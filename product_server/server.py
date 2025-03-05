from flask import Flask, jsonify, render_template, send_from_directory
import json
from pathlib import Path

app = Flask(__name__)
PORT = 3000
PRODUCTS_FILE = Path(__file__).parent / 'products.json'

@app.route('/')
def index():
    return render_template('index.html')

@app.route('/static/<path:filename>')
def static_files(filename):
    return send_from_directory('static', filename)

@app.route('/api/products')
def get_products():
    try:
        with open(PRODUCTS_FILE, 'r', encoding='utf-8') as f:
            products = json.load(f)
        return jsonify(products)
    except FileNotFoundError:
        return jsonify({'error': 'Файл products.json не найден'}), 404
    except json.JSONDecodeError:
        return jsonify({'error': 'Ошибка в формате JSON'}), 500
    except Exception as e:
        return jsonify({'error': str(e)}), 500

if __name__ == '__main__':
    app.run(port=PORT, debug=True)