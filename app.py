from fastapi import FastAPI, Request, Form
from fastapi.responses import HTMLResponse
from fastapi.templating import Jinja2Templates
from fastapi.staticfiles import StaticFiles
import smtplib
from email.message import EmailMessage

app = FastAPI()

app.mount("/static", StaticFiles(directory="static"), name="static")
templates = Jinja2Templates(directory="templates")

@app.get("/", response_class=HTMLResponse)
async def home(request: Request):
    return templates.TemplateResponse("index.html", {"request": request})

@app.get("/products", response_class=HTMLResponse)
async def products(request: Request):
    return templates.TemplateResponse("products.html", {"request": request})

@app.get("/about", response_class=HTMLResponse)
async def about(request: Request):
    return templates.TemplateResponse("about.html", {"request": request})

@app.get("/contact", response_class=HTMLResponse)
async def contact(request: Request):
    return templates.TemplateResponse("contact.html", {"request": request})

@app.get("/privacy-policy", response_class=HTMLResponse)
def privacy_policy(request: Request):
    return templates.TemplateResponse("privacy-policy.html", {"request": request})

@app.get("/terms-of-service", response_class=HTMLResponse)
def terms_of_service(request: Request):
    return templates.TemplateResponse("terms-of-service.html", {"request": request})

@app.get("/flats", response_class=HTMLResponse)
def flats(request: Request):
    return templates.TemplateResponse("flats.html", {"request": request})

@app.get("/heels", response_class=HTMLResponse)
def heels(request: Request):
    return templates.TemplateResponse("heels.html", {"request": request})

@app.get("/wedges", response_class=HTMLResponse)
def wedges(request: Request):
    return templates.TemplateResponse("wedges.html", {"request": request})

@app.post("/contact", response_class=HTMLResponse)
async def contact_form(
    request: Request,
    name: str = Form(...),
    email: str = Form(...),
    message: str = Form(...)
):
    gmail_user = "farhanuddin0516@gmail.com"   # your Gmail address
    gmail_app_password = "zlxqqxcpjgmzrpdg"  # replace later

    # Build the email
    msg = EmailMessage()
    msg["Subject"] = "New Contact Form Submission - Madam Choice"
    msg["From"] = gmail_user
    msg["To"] = "farhanuddin0516@gmail.com"   # receive at your inbox
    msg.set_content(
        f"New message from Madam Choice Contact Form:\n\n"
        f"Name: {name}\n"
        f"Email: {email}\n"
        f"Message:\n{message}\n"
    )

    # Send via Gmail SMTP
    try:
        with smtplib.SMTP("smtp.gmail.com", 587) as server:
            server.starttls()
            server.login(gmail_user, gmail_app_password)
            server.send_message(msg)
        success = True
    except Exception as e:
        print("Email sending failed:", e)
        success = False

    return templates.TemplateResponse("contact.html", {"request": request, "success": success})