from flask import Flask, request, jsonify, render_template, send_from_directory
from flask_cors import CORS
import json
from pathlib import Path
import os

app = Flask(__name__)
CORS(app)  # Разрешаем CORS для всех доменов
PORT = 8080
PRODUCTS_FILE = Path(__file__).parent / '../product_server/products.json'

def load_products():
    try:
        with open(PRODUCTS_FILE, 'r', encoding='utf-8') as f:
            return json.load(f)
    except (FileNotFoundError, json.JSONDecodeError):
        return []

def save_products(products):
    with open(PRODUCTS_FILE, 'w', encoding='utf-8') as f:
        json.dump(products, f, indent=2, ensure_ascii=False)

@app.route('/')
def admin_panel():
    return render_template('admin.html')

@app.route('/static/<path:filename>')
def static_files(filename):
    return send_from_directory(os.path.join(app.root_path, 'static'), filename)

@app.route('/api/products', methods=['GET', 'POST'])
@app.route('/api/products/<int:id>', methods=['GET', 'PUT', 'DELETE'])
def handle_products(id=None):
    try:
        products = load_products()

        if request.method == 'GET':
            if id:  # GET /api/products/<id>
                product = next((p for p in products if p['id'] == id), None)
                return jsonify(product) if product else ('', 404)
            return jsonify(products)  # GET /api/products

        elif request.method == 'POST':  # POST /api/products
            data = request.get_json()
            if isinstance(data, list):
                for item in data:
                    item['id'] = max(p['id'] for p in products) + 1 if products else 1
                    products.append(item)
            else:
                data['id'] = max(p['id'] for p in products) + 1 if products else 1
                products.append(data)
            save_products(products)
            return jsonify({'message': 'Товары добавлены'}), 201

        elif request.method == 'PUT':  # PUT /api/products/<id>
            data = request.get_json()
            for i, p in enumerate(products):
                if p['id'] == id:
                    products[i] = {**p, **data}
                    save_products(products)
                    return jsonify(products[i])
            return jsonify({'error': 'Товар не найден'}), 404

        elif request.method == 'DELETE':  # DELETE /api/products/<id>
            new_products = [p for p in products if p['id'] != id]
            if len(new_products) == len(products):
                return jsonify({'error': 'Товар не найден'}), 404
            save_products(new_products)
            return jsonify({'message': 'Товар удален'})

    except Exception as e:
        return jsonify({'error': str(e)}), 500

if __name__ == '__main__':
    app.run(port=PORT, debug=True)