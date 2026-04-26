from flask import Flask, request, render_template_string

app = Flask(__name__)

@app.route("/", methods=["GET", "POST"])
def login():
    message = ""

    if request.method == "POST":
        username = request.form.get("username")
        password = request.form.get("password")

        # 🚨 Fake vulnerable "query"
        query = f"SELECT * FROM users WHERE username = '{username}' AND password = '{password}'"

        if "admin" in query and ("' OR '1'='1" in query or "--" in query):
            message = "Welcome admin! Flag: CTF{testflag}"
        elif username == "admin" and password == "password123":
            message = "Welcome admin! (but no flag for legit login 😏)"
        else:
            message = "Invalid credentials"

    return render_template_string("""
    <!DOCTYPE html>
    <html>
    <head>
        <title>Admin Login</title>
        <style>
            body {
                margin: 0;
                height: 100vh;
                display: flex;
                justify-content: center;
                align-items: center;
                background-color: #0a0a0a;
                font-family: Arial, sans-serif;
                color: #e0e0e0;
            }

            .card {
                background: #111;
                padding: 40px;
                border-radius: 12px;
                box-shadow: 0 0 20px rgba(0, 255, 255, 0.08);
                width: 300px;
                text-align: center;
                border: 1px solid #1f1f1f;
            }

            h2 {
                margin-bottom: 25px;
                color: #00ffff;
                font-weight: 500;
            }

            input {
                width: 100%;
                padding: 10px;
                margin: 10px 0;
                border: none;
                border-radius: 6px;
                background: #1a1a1a;
                color: #fff;
                outline: none;
            }

            input:focus {
                border: 1px solid #00ffff;
            }

            button {
                width: 100%;
                padding: 10px;
                margin-top: 15px;
                border: none;
                border-radius: 6px;
                background: #00ffff;
                color: #000;
                font-weight: bold;
                cursor: pointer;
                transition: 0.2s;
            }

            button:hover {
                background: #00cccc;
            }

            p {
                margin-top: 15px;
                font-size: 14px;
                color: #aaa;
            }

            .hint {
                margin-top: 10px;
                font-size: 12px;
                color: #444;
            }
        </style>
    </head>
    <body>
        <div class="card">
            <h2>Admin Login</h2>
            <form method="POST">
                <input name="username" placeholder="Username">
                <input name="password" type="password" placeholder="Password">
                <button type="submit">Login</button>
            </form>
            <p>{{message}}</p>
            <div class="hint">Hint: Sometimes comments help 😉</div>
        </div>
    </body>
    </html>
    """, message=message)


if __name__ == "__main__":
    app.run(host="0.0.0.0", port=5000)