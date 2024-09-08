import Product from '../models/Product.js';
import { launch } from 'puppeteer';
import { fileURLToPath } from 'url';
import path from 'path';

const getPdfPath = (filename) => {
    const __filename = fileURLToPath(import.meta.url);
    const __dirname = path.dirname(__filename);
    return path.join(__dirname, '../invoices', filename);
};

// Add products and generate invoice
export async function addProducts(req, res) {
    const { products } = req.body;
    try {
        // Calculate total including GST
        const productsWithGST = products.map(product => {
            const gst = product.rate * 0.18; // GST calculation
            const total = (product.rate + gst) * product.qty; // Total including GST
            return { ...product, gst, total }; // Add GST and total to the product object
        });

        // Save products to database
        await Product.insertMany(productsWithGST.map(product => ({
            ...product,
            userId: req.user.id,
            date: new Date(),
        })));

        // Generate PDF and image
        const pdfPath = getPdfPath(`invoice-${Date.now()}.pdf`);
        const imagePath = getPdfPath(`invoice-${Date.now()}.png`);

        const browser = await launch();
        const page = await browser.newPage();
        
        const content = `
            <html>
            <head>
                <style>
                    body {
                        font-family: Arial, sans-serif;
                        margin: 20px;
                    }
                    table {
                        width: 100%;
                        border-collapse: collapse;
                        margin-bottom: 20px;
                    }
                    table, th, td {
                        border: 1px solid black;
                    }
                    th, td {
                        padding: 8px;
                        text-align: left;
                    }
                    th {
                        background-color: #f2f2f2;
                    }
                    .total-row, .footer-row {
                        border-top: 2px solid black;
                        border-bottom: 2px solid black;
                    }
                    .right-align {
                        text-align: right;
                    }
                    .grand-total {
                        font-weight: bold;
                    }
                </style>
            </head>
            <body>
                <h1>Invoice</h1>
                <table>
                    <thead>
                        <tr>
                            <th>Product</th>
                            <th>Qty</th>
                            <th>Rate</th>
                            <th>Total</th>
                        </tr>
                    </thead>
                    <tbody>
                        ${productsWithGST.map(product => `
                            <tr>
                                <td>${product.name}</td>
                                <td>${product.qty}</td>
                                <td>${product.rate}</td>
                                <td>INR ${product.total}</td>
                            </tr>
                        `).join('')}
                        <tr class="total-row">
                            <td colspan="3" class="right-align">Total</td>
                            <td>INR ${productsWithGST.reduce((acc, product) => acc + product.total, 0)}</td>
                        </tr>
                        <tr>
                            <td colspan="3" class="right-align">GST</td>
                            <td>18%</td>
                        </tr>
                        <tr class="footer-row grand-total">
                            <td colspan="3" class="right-align">Grand Total</td>
                            <td>INR ${productsWithGST.reduce((acc, product) => acc + product.total, 0)}</td>
                        </tr>
                    </tbody>
                </table>
            </body>
            </html>
        `;
        
        await page.setContent(content);
        await page.pdf({ path: pdfPath, format: 'A4' });
        await page.screenshot({ path: imagePath, fullPage: true });

        await browser.close();

        return res.json({ message: 'Invoice generated', pdfUrl: pdfPath, imageUrl: imagePath });
    } catch (error) {
        return res.status(500).json({ message: 'Server error' });
    }
}

// View all quotations (invoices)
export async function viewQuotations(req, res) {
    try {
        const quotations = await Product.find({ userId: req.user.id });
        return res.json({ quotations });
    } catch (error) {
        return res.status(500).json({ message: 'Server error' });
    }
}
