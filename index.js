let Discord = require('discord.js')
let Client = new Discord.Client()
let dotenv = require('dotenv');
const prefix = '!';

// Grabs the BOT_TOKEN from .env and stores in on the `process.env`
dotenv.load()

let allowedRoles = process.env.ALLOWED_ROLES.split(',')
let botToken = process.env.BOT_TOKEN

// allowed strings
let allowedString = ''
allowedRoles.forEach((role) => {
  allowedString = allowedString.concat('- ' + role + '\n')
})

Client.on('message', message => {
  // Set prefix
  if (message.content.indexOf(prefix) !== 0) return;
 
  const args = message.content.slice(prefix.length).trim().split(/ +/g);
  const command = args.shift().toLowerCase();
  
  // Add Role Command
  if (command === 'addrole')
  
  {

    // Get args
    let args = message.content.split(" ");

    if (args.length < 2 || args[1] == null) {
      message.channel.sendMessage('Use the `!rolelist` command for a list of roles to join/leave.')

      return
    }

    // Get the role
    let role = message.guild.roles.find("name", args[1].toLowerCase());

    if (!role || role === null) {
      message.channel.sendMessage('Could not find a role by that name.')
      return
    }

    if (allowedRoles.indexOf(role.name) === -1) {
      message.channel.sendMessage('You are not allowed to join that role.`')
      return
    }

    message.member.addRole(role).catch(console.error);
    message.channel.sendMessage('You\'ve been added to: ' + role.name)

    return
  }
  
  //Remove Role Command
  if (command === 'removerole') 
  {

    // Get args
    let args = message.content.split(" ");

    if (args.length < 2 || args[1] == null) {
      message.channel.sendMessage('Use the `!rolelist` command for a list of roles to join/leave.')
      return
    }

    // Get the role
    let role = message.guild.roles.find("name", args[1].toLowerCase());

    if (!role || role === null) {
      message.channel.sendMessage('Could not find a role by that name.')
      return
    }

    if (allowedRoles.indexOf(role.name) === -1) {
      message.channel.sendMessage('Doesn\'t look like you\'re allowed to join that group. \nFor a list of allowed roles type `!role --help`')
      return
    }

    message.member.removeRole(role).catch(console.error);
    message.channel.sendMessage('You\'ve been removed from: ' + role.name)

    return
  }

  //Help Command
  if (command === 'rolelist') {
    message.channel.sendMessage('**These are the available roles to join:** ```\n'+
    allowedString +
    '```\nUse `!AddRole <role_name>` to join a role or use `!RemoveRole <role_name>` to leave a role.')

  return
  }

})

Client.on("guildMemberAdd", member => {
    console.log(`New User "${member.user.username}" has joined "${member.guild.name}"` );

    //member.guild.defaultChannel.sendMessage(`Welcome "${member.user.username}"! Be sure to set your platform by typing "!role"`);
})

Client.on('ready', () => {
  Client.user.setGame('type !addrole or !removerole')
  console.log(`Ready to set roles in ${Client.channels.size} channels on ${Client.guilds.size} servers, for a total of ${Client.users.size} users.`)
})

Client.on('error', e => { console.error(e) })

Client.login(botToken)
