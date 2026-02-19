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
            InlineKeyboardButton(
                "📢 Join Community",
                url="https://t.me/PupByteOfficial"
            )
        ]
    ]

    reply_markup = InlineKeyboardMarkup(keyboard)

    await update.message.reply_text(
        "🚀 Welcome to PupByte Official Network!",
        reply_markup=reply_markup
    )

app = ApplicationBuilder().token(TOKEN).build()
app.add_handler(CommandHandler("start", start))

print("Bot Running...")
app.run_polling()
