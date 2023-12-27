    let products = [];
    let stockHistory = [];

    function showProductPage() {
        const content = `
            <h2 class="text-2xl font-bold mb-4">Catat Barang</h2>
            <form id="productForm" class="mb-8">
                ${createInput("productName", "Nama Barang", "text", true)}
                ${createInput("productCode", "Kode Barang (SKU)", "text", true)}
                ${createInput("productDescription", "Deskripsi Barang", "textarea", true)}
                ${createInput("productCategory", "Kategori Barang", "text", true)}
                ${createInput("supplierInfo", "Informasi Pemasok", "text", true)}
                <button type="button" onclick="recordProduct()" class="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded">
                    Simpan
                </button>
            </form>
        `;
        updateContent(content);
    }

    function showStockPage() {
        let content = `
            <h2 class="text-2xl font-bold mb-4">Tambah Jumlah Stok Masuk</h2>
            <form id="stockForm" class="mb-8">
                ${createInput("productCodeStock", "Kode Barang (SKU)", "text", true)}
                ${createInput("quantityIn", "Jumlah Stok Masuk", "number", true)}
                <button type="button" onclick="updateStock()" class="bg-green-500 hover:bg-green-700 text-white font-bold py-2 px-4 rounded">
                    Simpan
                </button>
            </form>
            ${generateStockHistoryTable()}
        `;
        updateContent(content);
    }

    function showStockOutPage() {
        let content = `
            <h2 class="text-2xl font-bold mb-4">Kurangi Jumlah Stok Keluar</h2>
            <form id="stockOutForm" class="mb-8">
                ${createInput("productCodeStockOut", "Kode Barang (SKU)", "text", true)}
                ${createInput("quantityOut", "Jumlah Stok Keluar", "number", true)}
                <button type="button" onclick="updateStockOut()" class="bg-red-500 hover:bg-red-700 text-white font-bold py-2 px-4 rounded">
                    Simpan
                </button>
            </form>
            ${generateStockOutHistoryTable()}
        `;
        updateContent(content);
    }

    function showFinalDataPage() {
        let content = `
            <h2 class="text-2xl font-bold mb-4">Hasil Final Data</h2>
            ${generateFinalDataTable()}
        `;
        updateContent(content);
    }

    function createInput(id, label, type, required) {
        return `
            <label for="${id}" class="block text-sm font-medium text-gray-600">${label}:</label>
            <input type="${type}" id="${id}" ${required ? "required" : ""} class="mt-1 p-2 border rounded-md w-full">
        `;
    }

    function updateContent(content) {
        document.getElementById("content").innerHTML = content;
    }

    function recordProduct() {
        const product = {
            name: getValue("productName"),
            code: getValue("productCode"),
            description: getValue("productDescription"),
            category: getValue("productCategory"),
            supplier: getValue("supplierInfo"),
        };

        products.push(product);

        resetForm("productForm");
        alert("Barang berhasil dicatat!");
    }

    function updateStock() {
        const productCodeStock = getValue("productCodeStock");
        const quantityIn = parseInt(getValue("quantityIn"));

        const product = products.find(p => p.code === productCodeStock);

        if (product) {
            product.stock = (product.stock || 0) + quantityIn;

            stockHistory.push({
                productCode: productCodeStock,
                quantity: quantityIn,
                date: new Date().toLocaleString(),
            });

            resetForm("stockForm");
            alert("Jumlah stok masuk berhasil dicatat!");
        } else {
            alert("Barang dengan kode tersebut tidak ditemukan.");
        }

        showStockPage();
    }

    function updateStockOut() {
        const productCodeStockOut = getValue("productCodeStockOut");
        const quantityOut = parseInt(getValue("quantityOut"));

        const product = products.find(p => p.code === productCodeStockOut);

        if (product) {
            if (product.stock && product.stock >= quantityOut) {
                product.stock -= quantityOut;

                stockHistory.push({
                    productCode: productCodeStockOut,
                    quantity: -quantityOut, // Negative quantity for stock out
                    date: new Date().toLocaleString(),
                });

                resetForm("stockOutForm");
                alert("Jumlah stok keluar berhasil dicatat!");
            } else {
                alert("Stok tidak mencukupi untuk keluar.");
            }
        } else {
            alert("Barang dengan kode tersebut tidak ditemukan.");
        }

        showStockOutPage();
    }

    function getValue(elementId) {
        return document.getElementById(elementId).value;
    }

    function resetForm(formId) {
        document.getElementById(formId).reset();
    }

    function generateStockHistoryTable() {
        let table = `
            <h3 class="text-xl font-bold mb-2">Riwayat Jumlah Stok Masuk</h3>
            <table class="w-full border-collapse border">
                <thead>
                    <tr class="bg-gray-200">
                        <th class="p-2 border">Kode Barang</th>
                        <th class="p-2 border">Nama Barang</th>
                        <th class="p-2 border">Kategori Barang</th>
                        <th class="p-2 border">Jumlah Masuk</th>
                        <th class="p-2 border">Tanggal</th>
                    </tr>
                </thead>
                <tbody>
                    ${generateStockHistoryRows()}
                </tbody>
            </table>
        `;

        return table;
    }

    function generateStockHistoryRows() {
        let rows = "";

        for (let entry of stockHistory.filter(entry => entry.quantity > 0)) {
            const product = products.find(p => p.code === entry.productCode);

            rows += `
                <tr class="border">
                    <td class="p-2 border">${entry.productCode}</td>
                    <td class="p-2 border">${product ? product.name : '-'}</td>
                    <td class="p-2 border">${product ? product.category : '-'}</td>
                    <td class="p-2 border">${entry.quantity}</td>
                    <td class="p-2 border">${entry.date}</td>
                </tr>
            `;
        }

        return rows;
    }

    function generateStockOutHistoryTable() {
        let rows = stockHistory.filter(entry => entry.quantity < 0).map(entry => {
            const product = products.find(p => p.code === entry.productCode);
            return `
                <tr class="border">
                    <td class="p-2 border">${entry.productCode}</td>
                    <td class="p-2 border">${product ? product.name : '-'}</td>
                    <td class="p-2 border">${product ? product.category : '-'}</td>
                    <td class="p-2 border">${-entry.quantity}</td> <!-- Display positive quantity -->
                    <td class="p-2 border">${entry.date}</td>
                </tr>
            `;
        }).join("");

        let table = `
            <h3 class="text-xl font-bold mb-2">Riwayat Jumlah Stok Keluar</h3>
            <table class="w-full border-collapse border">
                <thead>
                    <tr class="bg-gray-200">
                        <th class="p-2 border">Kode Barang</th>
                        <th class="p-2 border">Nama Barang</th>
                        <th class="p-2 border">Kategori Barang</th>
                        <th class="p-2 border">Jumlah Keluar</th>
                        <th class="p-2 border">Tanggal</th>
                    </tr>
                </thead>
                <tbody>
                    ${rows}
                </tbody>
            </table>
        `;

        return table;
    }

    function generateFinalDataTable() {
        let table = `
            <h3 class="text-xl font-bold mb-2"></h3>
            <table class="w-full border-collapse border">
                <thead>
                    <tr class="bg-gray-200">
                        <th class="p-2 border">Kode Barang</th>
                        <th class="p-2 border">Nama Barang</th>
                        <th class="p-2 border">Kategori Barang</th>
                        <th class="p-2 border">Jumlah Stok</th>
                    </tr>
                </thead>
                <tbody>
                    ${generateFinalDataRows()}
                </tbody>
            </table>
        `;

        return table;
    }

    function generateFinalDataRows() {
        let rows = "";

        for (let product of products) {
            rows += `
                <tr class="border">
                    <td class="p-2 border">${product.code}</td>
                    <td class="p-2 border">${product.name}</td>
                    <td class="p-2 border">${product.category}</td>
                    <td class="p-2 border">${product.stock || 0}</td>
                </tr>
            `;
        }

        return rows;
    }


    function showSalesPage() {
        const content = generateTransactionPage("Penjualan", "productCodeSales", "quantitySold", "recordSales", "Riwayat Penjualan", -1);
        updateContent(content);
    }

    function showPurchasePage() {
        const content = generateTransactionPage("Pembelian", "productCodePurchase", "quantityPurchased", "recordPurchase", "Riwayat Pembelian", 1);
        updateContent(content);
    }function generateTransactionPage(productCodeId, quantityId, priceId, recordFunction, historyTitle) {
        const form = `
            <h2 class="text-2xl font-bold mb-4">Pencatatan ${historyTitle}</h2>
            <form id="${historyTitle.toLowerCase()}Form" class="mb-8">
                ${createInput(productCodeId, "Kode Barang (SKU)", "text", true)}
                ${createInput(quantityId, `Jumlah ${historyTitle.toLowerCase()}`, "number", true)}
                ${createInput(priceId, `Harga ${historyTitle.toLowerCase()}`, "number", true)}
                <button type="button" onclick="${recordFunction}()" class="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded bg-purple-500 hover:bg-purple-700">
                    Catat ${historyTitle}
                </button>
            </form>
        `;

        const table = generateTransactionTable(historyTitle);

        return form + table;
    }

    function generateTransactionTable(historyTitle) {
        const rows = stockHistory.filter(entry => entry.quantity > 0).map(entry => {
            const product = products.find(p => p.code === entry.productCode);
            return `
                <tr class="border">
                    <td class="p-2 border">${entry.productCode}</td>
                    <td class="p-2 border">${product ? product.name : '-'}</td>
                    <td class="p-2 border">${product ? product.category : '-'}</td>
                    <td class="p-2 border">${entry.quantity}</td>
                    <td class="p-2 border">${product ? product.price : '-'}</td>
                    <td class="p-2 border">${entry.date}</td>
                </tr>
            `;
        }).join("");

        return `
            <h3 class="text-xl font-bold mb-2">${historyTitle}</h3>
            <table class="w-full border-collapse border">
                <thead>
                    <tr class="bg-gray-200">
                        <th class="p-2 border">Kode Barang</th>
                        <th class="p-2 border">Nama Barang</th>
                        <th class="p-2 border">Kategori Barang</th>
                        <th class="p-2 border">Jumlah</th>
                        <th class="p-2 border">Harga</th>
                        <th class="p-2 border">Tanggal</th>
                    </tr>
                </thead>
                <tbody>
                    ${rows}
                </tbody>
            </table>
        `;
    }
