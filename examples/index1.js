const discord = require('discord.js')
const client = new discord.Client({intents: [discord.Intents.FLAGS.GUILDS, discord.Intents.FLAGS.GUILD_MESSAGES]});
const { Ticket, TicketInteraction } = require('./index.js')

client.on('messageCreate', async message => {
    if(message.author.bot) return;    

    if(message.content.startsWith('!deployticket')) {

    //here you can put whatever you want, I suggest making a permission filter
    const ticketembed = new Ticket({
        client: client,
        channel:client.channels.cache.get("873616872061435986"),
        configuration: {
            title: "Support Ticket", //default: Ticket Support
            description: "Press for support.", //default: Press the emoji to open a ticket
            buttonName: "Open Ticket", //default: Open Ticket
            color: "BLURPLE", //default: BLACK
            footer: "Powered by distickets", //default: Powered by discord-ticket
            openEmoji: "📖" //default: 📖
        }
      })

      ticketembed.create()

}})

client.on('interactionCreate', async interaction => {

    const ticketinter = new TicketInteraction({
        interaction: interaction,
        configuration: {
            openTitle: "Ticket Opened!", //default: Ticket Support
            openFooter: "powered by distickets",
            openDesc: `${interaction.user}, wait for a moderator to come!`, //default: Wait for a staffer
            openCategory: "ticket category id", //default: no one
            openColor: "BLURPLE", //default: BLACK
            ticketOpenTitle: "ERROR", //default = ERROR
            ticketOpenDescription: "You already have a ticket opened!", //default: You already have a ticket opened!
            ticketOpenFooter: `${interaction.guild.name}`, //default: server's name
            ticketOpenColor: "BLURPLE", //default: BLACK
            roleView: "role id", //id of the role allowed to see the tickets. 
            closeTitle: `Closing Ticket`, //default: CLosing Ticket
            closeDesc: `Ticket will close in 10s`, //adjust to match with closeTime
            closeTime: "10s", //default: 10s - use s for seconds, m for minutes, d for days
            closeButton: "Close ticket", //default: Close Ticket
            closeEmoji: "❎" //deafult: ❎ 
        }
    })
    ticketinter.onInteraction()
})



client.login('TOKEN')
