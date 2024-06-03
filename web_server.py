from flask import Flask


app = Flask(__name__, static_folder="game", static_url_path="/")

app.run("0.0.0.0", 54123)