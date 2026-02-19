import os
from telegram import InlineKeyboardButton, InlineKeyboardMarkup, WebAppInfo, Update
from telegram.ext import ApplicationBuilder, CommandHandler, ContextTypes

TOKEN = os.getenv("TOKEN")

async def start(update: Update, context: ContextTypes.DEFAULT_TYPE):

    keyboard = [
        [
            InlineKeyboardButton(
                "🚀 Play & Mine",
                web_app=WebAppInfo(
                    url="https://akshaymade12.github.io/PupByteTapApp/"
                )
            )
        ],
        [
            InlineKeyboardButton("💰 Earn Rewards"),
            InlineKeyboardButton("👥 Invite Friends")
        ],
        [
            InlineKeyboardButton("📊 Dashboard"),
            InlineKeyboardButton(
                "📢 Join Community",
                url="https://t.me/PupByteOfficial"
            )
        ]
    ]

    reply_markup = InlineKeyboardMarkup(keyboard)

    text = """
🚀 *PupByte Official Network is Back!*

We're back — bigger and better than ever.

Welcome to *PupByte Player* 🎮

🎯 Interactive Games  
🎁 Exclusive Airdrops  
💎 Daily Rewards  

Start mining and grow your $PBYTE today!
"""

    await update.message.reply_text(
        text,
        parse_mode="Markdown",
        reply_markup=reply_markup
    )

app = ApplicationBuilder().token(TOKEN).build()
app.add_handler(CommandHandler("start", start))

print("Bot Running...")
app.run_polling()
