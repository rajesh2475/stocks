from flask import Flask, render_template

app = Flask(__name__)

@app.route('/')
def index():
    return render_template("index.html")

@app.route('/sip_calculator')
def sip_calculator():
    return render_template("sip_calculator.html")

if __name__ == '__main__':
    app.run(debug=True)