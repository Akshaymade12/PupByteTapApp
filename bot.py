import os
import threading
from flask import Flask
from telegram import InlineKeyboardButton, InlineKeyboardMarkup, WebAppInfo, Update
from telegram.ext import ApplicationBuilder, CommandHandler, ContextTypes

TOKEN = os.getenv("TOKEN")

# Flask app for Render port binding
app_flask = Flask(__name__)

@app_flask.route('/')
def home():
    return "PupByte Bot is Running!"

def run_flask():
    port = int(os.environ.get("PORT", 10000))
    app_flask.run(host="0.0.0.0", port=port)

async def start(update: Update, context: ContextTypes.DEFAULT_TYPE):

    keyboard = [
        [
            InlineKeyboardButton(
                "🚀 Play & Mine",
                web_app=WebAppInfo(
                    url="https://akshaymade12.github.io/PupByteTapApp/"
                )
            )
        ]
    ]

    reply_markup = InlineKeyboardMarkup(keyboard)

    await update.message.reply_text(
        "🚀 Welcome to PupByte Official Network!",
        reply_markup=reply_markup
    )

async def run_bot():
    application = ApplicationBuilder().token(TOKEN).build()
    application.add_handler(CommandHandler("start", start))

    print("Bot Running...")
    await application.run_polling()

if __name__ == "__main__":
    threading.Thread(target=run_flask).start()
    import asyncio
    asyncio.run(run_bot())
