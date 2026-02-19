import os
from telegram import InlineKeyboardButton, InlineKeyboardMarkup, WebAppInfo
from telegram.ext import Updater, CommandHandler

TOKEN = os.getenv("TOKEN")

def start(update, context):

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

    update.message.reply_text(
        "🚀 Welcome to PupByte Official Network!",
        reply_markup=reply_markup
    )

def main():
    updater = Updater(TOKEN, use_context=True)
    dp = updater.dispatcher
    dp.add_handler(CommandHandler("start", start))

    updater.start_polling()
    updater.idle()

if __name__ == "__main__":
    main()
