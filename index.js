const Discord = require("discord.js")

const { MessageActionRow, MessageButton } = require('discord.js');
const ms = require("ms")


class Ticket {
    constructor({client, channel, configuration={title, description, color, footer, buttonName, openEmoji}}) {
        this.client = client;
        this.channel = channel;
        this.config = configuration;
    }

    async create() {

        const row = new MessageActionRow()
            .addComponents(
                new MessageButton()
                    .setCustomId('ticket_aperto')
                    .setLabel(this.config.buttonName ||'Open Ticket')
                    .setStyle('PRIMARY')
                    .setEmoji(this.config.openEmoji || "📖"));


        let embed = new Discord.MessageEmbed()
        .setTitle(this.config.title || "Ticket Support")
        .setDescription(this.config.description || "Press the button to open a ticket.")
        .setColor(this.config.color)
        .setFooter(this.config.footer || "Powered by distickets")

        await this.channel.send({embeds: [embed], components: [row]})            

    }

}

class TicketInteraction {
    constructor({interaction, configuration={ openTitle, openDesc, openCategory, openColor, roleView, closeTitle, closeDesc, closeButton, closeTime, ticketOpenTitle, ticketOpenDescription, ticketOpenFooter, ticketOpenColor , openFooter, closeEmoji}}) {
        this.interaction = interaction
        this.config = configuration
    }

    async onInteraction() {
        if(this.interaction.isButton()) {

            if(this.interaction.customId === "ticket_aperto"){
          
          
          let ticketgiaaperto = this.interaction.guild.channels.cache.find(canale => canale.name === `ticket-${this.interaction.user.username}`.toLowerCase())
          
          if(ticketgiaaperto){
          
              const ticketopen = new Discord.MessageEmbed()
              .setTitle(this.config.ticketOpenTitle || "ERROR")
              .setDescription(this.config.ticketOpenDescription || "You already have a ticket opened!")
              .setFooter(this.config.ticketOpenFooter || `${this.interaction.guild.name}`)
              .setColor(this.config.ticketOpenColor || "BLACK")
             this.interaction.member.send({ embeds: [ticketopen] });
          
          } else if(!ticketgiaaperto){
                        this.interaction.guild.channels.create(`ticket-${this.interaction.user.username}`, {
                          type: "text",
                          parent: this.config.openCategory || null,
                          permissionOverwrites: [
                              {
                                  id: this.interaction.message.guild.roles.everyone,
                                  deny: ['VIEW_CHANNEL', 'SEND_MESSAGES']
                              },
                              {
                                  id: this.interaction.user.id,
                                  allow: ['VIEW_CHANNEL', 'SEND_MESSAGES']
                              },
                              {
                              id: this.config.roleView || this.interaction.user.id,
                              allow: ['VIEW_CHANNEL', 'SEND_MESSAGES']
                              }
                          ],
                      }).then(canale => {
          canale.setTopic(`Created by ${this.interaction.user.tag} (${this.interaction.user.id})`)
          
          let rowch = new MessageActionRow()
            .addComponents(
            new MessageButton()
            .setCustomId("ticket_close")
            .setStyle("DANGER")
            .setLabel(this.config.closeButton ||"Close Ticket")
            .setEmoji(this.config.closeEmoji || `❎`))
              
                            
            const embedcreated = new Discord.MessageEmbed()
              .setColor(this.config.openColor)
              .setAuthor(this.interaction.user.tag, this.interaction.user.displayAvatarURL())
              .setTitle(this.config.openTitle ||"Ticket Support")
              .setDescription(this.config.openDesc ||`Wait for a staffer.`)
              .setThumbnail(this.interaction.user.displayAvatarURL())
              .setFooter(this.config.openFooter || "Powered by distickets")
              .setTimestamp()
              canale.send({ content: `<@&${this.config.roleView}>,` || `${this.interaction.user},`, embeds: [embedcreated], components: [rowch] })
                  
                  
                      })
          }
          
          
            } else if(this.interaction.customId === "ticket_close"){
              this.interaction.deferUpdate()
              const closed = new Discord.MessageEmbed()
              .setAuthor(this.interaction.user.tag, this.interaction.user.displayAvatarURL())
            .setColor("#ec3737")
            .setTitle(this.config.closeTitle || "Closing Ticket")
            .setDescription(this.config.closeDesc || "Ticket will close in \`10s\`.")
            .setThumbnail(this.interaction.user.displayAvatarURL())
            .setTimestamp()
              this.interaction.message.edit({ embeds: [closed], components: [] })
          
          setTimeout(() => {
          this.interaction.message.guild.channels.cache.get(this.interaction.message.channel.id).delete()
          }, ms(`${this.config.closeTime}`) || ms("10s"))
            }
          
            }
    }
    
}


module.exports = { Ticket, TicketInteraction }
