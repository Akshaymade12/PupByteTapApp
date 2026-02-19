from telegram import (
    Update,
    InlineKeyboardButton,
    InlineKeyboardMarkup,
    WebAppInfo
)
from telegram.ext import (
    ApplicationBuilder,
    CommandHandler,
    ContextTypes
)
import os

TOKEN = os.getenv("TOKEN")

async def start(update: Update, context: ContextTypes.DEFAULT_TYPE):

    # Buttons layout
    keyboard = [
        [InlineKeyboardButton("🚀 Play & Mine", web_app=WebAppInfo(url="https://akshaymade12.github.io/PupByteTapApp/")],
        [
            InlineKeyboardButton("💰 Earn Rewards"),
            InlineKeyboardButton("👥 Invite Friends")
        ],
        [
            InlineKeyboardButton("📊 Dashboard"),
            InlineKeyboardButton("📢 Join Community", url="https://t.me/PupByteOfficial")
        ]
    ]

    reply_markup = InlineKeyboardMarkup(keyboard)

    message = f"""
🚀 *PupByte Official Network is Back!*

We're back — bigger and better than ever.

Welcome to *PupByte Player* 🎮

🎯 Interactive Games  
🎁 Exclusive Airdrops  
💎 Daily Rewards  

Start mining and grow your $PBYTE today!
"""

    await update.message.reply_await update.message.reply_photo(
    photo="https://github.com/Akshaymade12/PupByteTapApp//main/PupByteOfficial.jpeg
    caption=message,
    parse_mode="Markdown",
    reply_markup=reply_markup
)
        parse_mode="Markdown",
        reply_markup=reply_markup
    )


app = ApplicationBuilder().token(TOKEN).build()
app.add_handler(CommandHandler("start", start))

print("Bot Running...")
app.run_polling()​
