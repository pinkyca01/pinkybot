// Script FxSx
// Recode Pinky
const {
    WAConnection,
    MessageType,
    Presence,
    MessageOptions,
    Mimetype,
    WALocationMessage,
	WA_MESSAGE_STUB_TYPES,
	WA_DEFAULT_EPHEMERAL,
	WAMessageProto,
	ProxyAgent,
	GroupSettingChange,
	waChatKey,
	mentionedJid,
	processTime
} = require('@adiwajshing/baileys')
const qrcode = require("qrcode-terminal")
const moment = require('moment-timezone')
const fs = require('fs')
const { exec } = require('child_process')
const fetch = require('node-fetch')
const tiktod = require('tiktok-scraper')
const ffmpeg = require('fluent-ffmpeg')
const axios = require("axios")
const { removeBackgroundFromImageFile } = require('remove.bg')
const imgbb = require('imgbb-uploader')
const lolis = require('lolis.life')
const loli = new lolis()
const { caa } = require('./pinky')
const { color, bgcolor } = require('./lib/color')
const { fetchJson } = require('./lib/fetcher')
const { recognize } = require('./lib/ocr')
const { wait, getBuffer, h2k, generateMessageID, getGroupAdmins, getRandom, banner, start, info, success, close } = require('./lib/functions')
const { aboutmenu, grupmenu, funnymenu, ownermenu, allmenu } = require('./pinky/pinkyca')

// Data Json
const welkom = JSON.parse(fs.readFileSync('./database/welkom.json'))
const user = JSON.parse(fs.readFileSync('./database/user.json'))
// End Data Json

const vcard = 'BEGIN:VCARD\n'
            + 'VERSION:3.0\n'
            + 'FN:Kepo Amat Jomblo\n'
            + 'ORG:Awokawok;\n'
            + 'TEL;type=CELL;type=VOICE;waid=6283815956151:+62 838-1595-6151\n'
            + 'END:VCARD'

public = false
prefix = "#"
namabot = "Pinky Bot"
LolApi = "7f5a6556983b0bf183028c20"
blocked = []

function kyun(seconds){
  function pad(s){
    return (s < 10 ? '0' : '') + s;
  }
  var hours = Math.floor(seconds / (60*60));
  var minutes = Math.floor(seconds % (60*60) / 60);
  var seconds = Math.floor(seconds % 60);

  return `${pad(hours)} Jam ${pad(minutes)} Menit ${pad(seconds)} Detik`
}

async function starts() {
	const nuy = new WAConnection()
	nuy.logger.level = 'warn'
	console.log(banner.string)
	nuy.version = [2, 2119, 6]
	nuy.on('qr', () => {
		console.log(color('[','white'), color('!','red'), color(']','white'), color('Kode Qr Ready Kak'))
	})
	nuy.on('credentials-updated', () => {
		fs.writeFileSync('./PinkyCa.json', JSON.stringify(nuy.base64EncodedAuthInfo(), null, '\t'))
		info('2', 'Login Pinky Update')
	})
	fs.existsSync('./PinkyCa.json') && nuy.loadAuthInfo('./PinkyCa.json')
	nuy.on('connecting', () => {
		start('2', 'Connecting...')
	})
	nuy.on('open', () => {
		success('2', 'Connected')
	})
	await nuy.connect({timeoutMs: 30*1000})

	nuy.on('group-participants-update', async (anu) => {
		if (!welkom.includes(anu.jid)) return
			try {
            mem = anu.participants[0]
			console.log(anu)
            try {
            pp_user = await nuy.getProfilePicture(mem)
            } catch (e) {
            pp_user = 'https://cdn.pixabay.com/photo/2015/10/05/22/37/blank-profile-picture-973460_960_720.png?q=60'
            }
            try {
            pp_grup = await nuy.getProfilePicture(anu.jid)
            } catch (e) {
            pp_grup = 'https://cdn.pixabay.com/photo/2015/10/05/22/37/blank-profile-picture-973460_960_720.png?q=60'
            }
       if (anu.action == 'add') {
            mdata = await nuy.groupMetadata(anu.jid)
            member = mdata.participants.length
        	num = anu.participants[0]
            anu_user = nuy.contacts[mem]
            teks = `*Hallo* @${num.split('@')[0]}\nSelamat datang di group *${mdata.subject}*\nJangan rusuh ya\nJangan lupa intro @${num.split('@')[0]} 🗣`
	        buffer = await getBuffer(`http://hadi-api.herokuapp.com/api/card/welcome2?nama=${encodeURIComponent(anu_user.notify)}&descriminator=${member}&memcount=${member}&gcname=${encodeURIComponent(mdata.subject)}&gcicon=${pp_grup}&pp=${pp_user}&bg=${pp_grup}`)
		    nuy.sendMessage(mdata.id, buffer, MessageType.image, {quoted: {key : {participant : '0@s.whatsapp.net'}, message: {orderMessage: {itemCount : 1, status: 1, surface : 1, message: `Welcome @${num.split('@')[0]}`, orderTitle: `Welcome @${num.split('@')[0]}`, thumbnail: fs.readFileSync('pinky.jpg'), sellerJid: '0@s.whatsapp.net'} } }, contextInfo: {"mentionedJid": [num]}, caption: teks})
	     	}
            if (anu.action == 'remove') {
                mdata = await nuy.groupMetadata(anu.jid)
            	num = anu.participants[0]
                anu_user = nuy.contacts[mem]
                member = mdata.participants.length
                teks = `*Kenapa Keluar Dari Grup* @${num.split('@')[0]}\n*Kyk Nya Sih Habis Di Omelin Sama Mamah Nya:V*`
                buffer = await getBuffer(`http://hadi-api.herokuapp.com/api/card/goodbye2?nama=${encodeURIComponent(anu_user.notify)}&descriminator=${member}&memcount=${member}&gcname=${encodeURIComponent(mdata.subject)}&gcicon=${pp_grup}&pp=${pp_user}&bg=${pp_grup}`)
                nuy.sendMessage(mdata.id, buffer, MessageType.image, {quoted: {key : {participant : '0@s.whatsapp.net'}, message: {orderMessage: {itemCount : 1, status: 1, surface : 1, message: `Keluar @${num.split('@')[0]}`, orderTitle: `Keluar @${num.split('@')[0]}`, thumbnail: fs.readFileSync('pinky.jpg'), sellerJid: '0@s.whatsapp.net'} } }, contextInfo: {"mentionedJid": [num]}, caption: teks})
            }
		} catch (e) {
			console.log('Error : %s', color(e, 'red'))
      }

    })
    
	nuy.on('CB:Blocklist', json => {
		if (blocked.length > 2) return
	    for (let i of json[1].blocklist) {
	    	blocked.push(i.replace('c.us','s.whatsapp.net'))
	    }
	})

	nuy.on('message-new', async (fxsx) => {
		try {
			if (!fxsx.message) return
			if (fxsx.key && fxsx.key.remoteJid == 'status@broadcast') return
			if (fxsx.key.fromMe) return
			global.prefix
			global.blocked
			const content = JSON.stringify(fxsx.message)
			const from = fxsx.key.remoteJid
			const type = Object.keys(fxsx.message)[0]
			const { text, extendedText, contact, location, liveLocation, image, video, sticker, document, audio, product } = MessageType
			const time = moment.tz('Asia/Jakarta').format('DD/MM HH:mm:ss')
			body = (type === 'conversation' && fxsx.message.conversation.startsWith(prefix)) ? fxsx.message.conversation : (type == 'imageMessage') && fxsx.message.imageMessage.caption.startsWith(prefix) ? fxsx.message.imageMessage.caption : (type == 'videoMessage') && fxsx.message.videoMessage.caption.startsWith(prefix) ? fxsx.message.videoMessage.caption : (type == 'extendedTextMessage') && fxsx.message.extendedTextMessage.text.startsWith(prefix) ? fxsx.message.extendedTextMessage.text : ''
			chats = (type === 'conversation') ? fxsx.message.conversation : (type === 'extendedTextMessage') ? fxsx.message.extendedTextMessage.text : ''
			var pes = (type === 'conversation' && fxsx.message.conversation) ? fxsx.message.conversation : (type == 'imageMessage') && fxsx.message.imageMessage.caption ? fxsx.message.imageMessage.caption : (type == 'videoMessage') && fxsx.message.videoMessage.caption ? fxsx.message.videoMessage.caption : (type == 'extendedTextMessage') && fxsx.message.extendedTextMessage.text ? fxsx.message.extendedTextMessage.text : ''
			const command = body.slice(1).trim().split(/ +/).shift().toLowerCase()
			const messagesCaa = pes.slice(0).trim().split(/ +/).shift().toLowerCase()
			const args = body.trim().split(/ +/).slice(1)
			const isCmd = body.startsWith(prefix)
			const arg = chats.slice(command.length + 2, chats.length)

			const botNumber = nuy.user.jid
			const ownerNumber = ["6285799496179@s.whatsapp.net"]
			const isGroup = from.endsWith('@g.us')
			const sender = fxsx.key.fromMe ? nuy.user.jid : isGroup ? fxsx.participant : fxsx.key.remoteJid
			pushname = nuy.contacts[sender] != undefined ? nuy.contacts[sender].vname || nuy.contacts[sender].notify : undefined
			const totalchat = await nuy.chats.all()
			const groupMetadata = isGroup ? await nuy.groupMetadata(from) : ''
			const groupName = isGroup ? groupMetadata.subject : ''
			const groupId = isGroup ? groupMetadata.jid : ''
			const groupMembers = isGroup ? groupMetadata.participants : ''
			const groupAdmins = isGroup ? getGroupAdmins(groupMembers) : ''
			const itsCa = sender === botNumber ? true : false
			const isBotGroupAdmins = groupAdmins.includes(botNumber) || false
			const isGroupAdmins = groupAdmins.includes(sender) || false
			const isWelkom = isGroup ? welkom.includes(from) : false
			const isOwner = ownerNumber.includes(sender)
			const isUser = user.includes(sender)
			const isUrl = (url) => {
			    return url.match(new RegExp(/https?:\/\/(www\.)?[-a-zA-Z0-9@:%._+~#=]{1,256}\.[a-zA-Z0-9()]{1,6}\b([-a-zA-Z0-9()@:%_+.~#?&/=]*)/, 'gi'))
			}
			const reply = (teks) => {
				nuy.sendMessage(from, teks, text, {quoted:fxsx})
			}
			const fakeitem = (teks) => {
                nuy.sendMessage(from, teks, MessageType.text, {quoted: { key: { fromMe:false, participant:`0@s.whatsapp.net`, ...(from ? {remoteJid :"6283815956151-1604595598@g.us" }: {}) },message:{"orderMessage":{"orderId":"174238614569481","thumbnail": fs.readFileSync('pinky.jpg'),"itemCount":29,"status":"INQUIRY","surface":"CATALOG","message": namabot,"token":"AR6xBKbXZn0Xwmu76Ksyd7rnxI+Rx87HfinVlW4lwXa6JA=="}}}, contextInfo: {"forwardingScore":99999,"isForwarded":true},sendEphemeral: true})
            }
			const sendMess = (hehe, teks) => {
				nuy.sendMessage(hehe, teks, text)
			}
			const mentions = (teks, memberr, id) => {
				(id == null || id == undefined || id == false) ? nuy.sendMessage(from, teks.trim(), extendedText, {contextInfo: {"mentionedJid": memberr}}) : nuy.sendMessage(from, teks.trim(), extendedText, {quoted: fxsx, contextInfo: {"mentionedJid": memberr}})
			}
			const ftroli ={key: {fromMe: false, participant: `0@s.whatsapp.net`, remoteJid: `0@s.whatsapp.net`}, "message": { "orderMessage": { "itemCount": 0, "status": 200, "thumbnail": fs.readFileSync('pinky.jpg'), "surface": 200, "message": namabot, "orderTitle": namabot, "sellerJid": `0@s.whatsapp.net`}}}, contextInfo: {"forwardingScore":999,"isForwarded":true}

			mess = {
				wait: 'Sedang Diproses',
				success: 'Sukses',
				error: {
					stick: 'Eror',
					Iv: 'Eror Kak'
				},
				only: {
					group: 'Khusus Group',
					ownerG: 'Khusus Owner Group',
					ownerB: 'Khusus Owner Pinky',
					userB: `Hai *${pushname}*\nKamu Belum Terdaftar\nSilahkan Ketik : ${prefix}pinkyca`,
					admin: 'Khusus Admin Group',
					Badmin: 'Khusus Jika Pinky Jadi Admin'
				}
			}

            if (messagesCaa.includes('assalamualaikum')){
            const loli = fs.readFileSync('./mp3/waalaikumsalam.mp3')
            nuy.sendMessage(from, loli, MessageType.audio, {quoted: fxsx, mimetype: 'audio/mp4', ptt:true, duration: 99999})
            }

			colors = ['red','white','black','blue','yellow','green']
			const isMedia = (type === 'imageMessage' || type === 'videoMessage')
			const isQuotedImage = type === 'extendedTextMessage' && content.includes('imageMessage')
			const isQuotedVideo = type === 'extendedTextMessage' && content.includes('videoMessage')
			const isQuotedSticker = type === 'extendedTextMessage' && content.includes('stickerMessage')
			if (itsCa){
			if (chats.toLowerCase() === `${prefix}self`){
				public = false
				fakeitem('STATUS : SELF')
			}
			if (chats.toLowerCase() === 'status'){
				fakeitem(`STATUS: ${public ? 'PUBLIC' : 'SELF'}`)
			}
		    }
		    if (!public){
		    	if (!fxsx.key.fromMe) return
    		}
			if (isCmd && !isGroup) {console.log(color('[CMD]'), color(moment(fxsx.messageTimestamp * 1000).format('DD/MM/YY HH:mm:ss'), 'yellow'), color(`${command} [${args.length}]`))}
            if (isCmd && isGroup) {console.log(color('[CMD]'), color(moment(fxsx.messageTimestamp * 1000).format('DD/MM/YY HH:mm:ss'), 'yellow'), color(`${command} [${args.length}]`), 'from', color(nuy.user.name), 'in', color(groupName))}
			switch(command) {
				/*case 'help':
				case 'menu':
				    if (!isUser) return fakeitem(mess.only.userB)
				    chatca = `
╭──「 *ABOUT* 」
┴𖧹
${prefix}info
${prefix}blocklist
${prefix}owner
> status
┬𖧹
╰────────𖧹

╭──「 *GRUP* 」
┴𖧹
${prefix}add
${prefix}kick
${prefix}listadmin
${prefix}tagall
${prefix}totag
┬𖧹
╰────────𖧹

╭──「 *FUNNY* 」
┴𖧹
${prefix}tts
${prefix}sticker
${prefix}trigger
${prefix}toimg
${prefix}hilih
${prefix}holoh
${prefix}tomp3
${prefix}wait
${prefix}ocr
┬𖧹
╰────────𖧹

╭──「 *OWNER* 」
┴𖧹
${prefix}public
${prefix}self
${prefix}setprefix
${prefix}setfname
${prefix}clearchat
${prefix}bc
${prefix}clone
┬𖧹
╰────────𖧹`
					nuy.sendMessage(from, chatca, MessageType.text, {quoted: fxsx})
					break*/
               case 'menu':
               case 'help':
                  if (!isUser) return fakeitem(mess.only.userB)
                  let pi = nuy.prepareMessageFromContent(from, {
					 "listMessage": {
						"title": "⌜ *PINKY MENU* ⌟",
						"description": `Hai ${pushname}\nSilahkan Gunakan Bot Pinky\nDengan Bijak!`,
						"buttonText": "Pinky Menu",
						"listType": "SINGLE_SELECT",
						"sections": [
						    {
								"title": "Pilih Salah Satu Kak",
								"rows": [
									{
										"title": "allmenu",
										"description": "\n\n𝕸𝖔𝖍𝖔𝖓 𝕿𝖚𝖓𝖌𝖌𝖚 𝕾𝖊𝖇𝖊𝖓𝖙𝖆𝖗",
										"rowId": "0"
									}]},
							{
								"title": "Pilih Salah Satu Kak",
								"rows": [
									{
										"title": "grupmenu",
										"description": "\n\n𝕸𝖔𝖍𝖔𝖓 𝕿𝖚𝖓𝖌𝖌𝖚 𝕾𝖊𝖇𝖊𝖓𝖙𝖆𝖗",
										"rowId": "0"
									}]},
							{
								"title": "Pilih Salah Satu Kak",
								"rows": [
									{
										"title": "funmenu",
										"description": "\n\n𝕸𝖔𝖍𝖔𝖓 𝕿𝖚𝖓𝖌𝖌𝖚 𝕾𝖊𝖇𝖊𝖓𝖙𝖆𝖗",
										"rowId": "0"
									}]},
							{
								"title": "Pilih Salah Satu Kak",
								"rows": [
									{
										"title": "aboutmenu",
										"description": "\n\n𝕸𝖔𝖍𝖔𝖓 𝕿𝖚𝖓𝖌𝖌𝖚 𝕾𝖊𝖇𝖊𝖓𝖙𝖆𝖗",
										"rowId": "0"
									}]},
							{
								"title": "Pilih Salah Satu Kak",
								"rows": [
									{
										"title": "ownermenu",
										"description": "\n\n𝕸𝖔𝖍𝖔𝖓 𝕿𝖚𝖓𝖌𝖌𝖚 𝕾𝖊𝖇𝖊𝖓𝖙𝖆𝖗",
										"rowId": "0"
									}]},
						]
                     }}, {})
                     nuy.relayWAMessage(pi, {waitForAck: true})
                     break
                case 'allmenu':                      
                    if (!isUser) return fakeitem(mess.only.userB)
                    nuy.sendMessage(from, caa.allmenu(prefix), text, {quoted: ftroli})                                                   
                    break     
                case 'grupmenu':                      
                    if (!isUser) return fakeitem(mess.only.userB)
                    nuy.sendMessage(from, caa.grupmenu(prefix), text, {quoted: ftroli})                                                   
                    break     
                case 'funmenu':                      
                    if (!isUser) return fakeitem(mess.only.userB)
                    nuy.sendMessage(from, caa.funmenu(prefix), text, {quoted: ftroli})                                                   
                    break     
                case 'aboutmenu':                      
                    if (!isUser) return fakeitem(mess.only.userB)
                    nuy.sendMessage(from, caa.aboutmenu(prefix), text, {quoted: ftroli})                                                   
                    break     
                case 'ownermenu':                      
                    if (!isUser) return fakeitem(mess.only.userB)
                    nuy.sendMessage(from, caa.ownermenu(prefix), text, {quoted: ftroli})                                                   
                    break     
// Info Bot
                case 'info':
                    if (!isUser) return fakeitem(mess.only.userB)
					me = nuy.user
					uptime = process.uptime()
					teks = `*Nama bot* : ${me.name}\n*Nomor Bot* : @${me.jid.split('@')[0]}\n*Prefix* : ${prefix}\n*Block* : ${blocked.length}\n*Bot On* : ${kyun(uptime)}`
					buffer = await getBuffer(me.imgUrl)
					nuy.sendMessage(from, buffer, image, {caption: teks, contextInfo:{mentionedJid: [me.jid]}})
					break
				case 'blocklist':
				    if (!isUser) return fakeitem(mess.only.userB)
					teks = 'This is list of blocked number :\n'
					for (let block of blocked) {
						teks += `~> @${block.split('@')[0]}\n`
					}
					teks += `Total : ${blocked.length}`
					nuy.sendMessage(from, teks.trim(), extendedText, {quoted: ftroli, contextInfo: {"mentionedJid": blocked}})
					break
// End Info Bot
// Fun Menu
				case 'stiker':
				case 'sticker':
				case 'sgif':
				case 's':
				    if (!isUser) return fakeitem(mess.only.userB)
					if ((isMedia && !fxsx.message.videoMessage || isQuotedImage) && args.length == 0) {
						const encmedia = isQuotedImage ? JSON.parse(JSON.stringify(fxsx).replace('quotedM','m')).message.extendedTextMessage.contextInfo : fxsx
						const media = await nuy.downloadAndSaveMediaMessage(encmedia)
						ran = getRandom('.webp')
						await ffmpeg(`./${media}`)
							.input(media)
							.on('start', function (cmd) {
								console.log(`Started : ${cmd}`)
							})
							.on('error', function (err) {
								console.log(`Error : ${err}`)
								fs.unlinkSync(media)
								fakeitem(mess.error.Iv)
							})
							.on('end', function () {
								console.log('Finish')
								buff = fs.readFileSync(ran)
								nuy.sendMessage(from, buff, sticker, {quoted: fxsx})
								fs.unlinkSync(media)
								fs.unlinkSync(ran)
							})
							.addOutputOptions([`-vcodec`,`libwebp`,`-vf`,`scale='min(320,iw)':min'(320,ih)':force_original_aspect_ratio=decrease,fps=15, pad=320:320:-1:-1:color=white@0.0, split [a][b]; [a] palettegen=reserve_transparent=on:transparency_color=ffffff [p]; [b][p] paletteuse`])
							.toFormat('webp')
							.save(ran)
					} else if ((isMedia && fxsx.message.videoMessage.seconds < 11 || isQuotedVideo && fxsx.message.extendedTextMessage.contextInfo.quotedMessage.videoMessage.seconds < 11) && args.length == 0) {
						const encmedia = isQuotedVideo ? JSON.parse(JSON.stringify(fxsx).replace('quotedM','m')).message.extendedTextMessage.contextInfo : fxsx
						const media = await nuy.downloadAndSaveMediaMessage(encmedia)
						ran = getRandom('.webp')
						fakeitem(mess.wait)
						await ffmpeg(`./${media}`)
							.inputFormat(media.split('.')[1])
							.on('start', function (cmd) {
								console.log(`Started : ${cmd}`)
							})
							.on('error', function (err) {
								console.log(`Error : ${err}`)
								fs.unlinkSync(media)
								tipe = media.endsWith('.mp4') ? 'video' : 'gif'
								if (err) return fakeitem(mess.error.Iv)
							})
							.on('end', function () {
								console.log('Finish')
								buff = fs.readFileSync(ran)
								nuy.sendMessage(from, buff, sticker, {quoted: fxsx})
								fs.unlinkSync(media)
								fs.unlinkSync(ran)
							})
							.addOutputOptions([`-vcodec`,`libwebp`,`-vf`,`scale='min(320,iw)':min'(320,ih)':force_original_aspect_ratio=decrease,fps=15, pad=320:320:-1:-1:color=white@0.0, split [a][b]; [a] palettegen=reserve_transparent=on:transparency_color=ffffff [p]; [b][p] paletteuse`])
							.toFormat('webp')
							.save(ran)
					} else if ((isMedia || isQuotedImage) && args[0] == 'nobg') {
						const encmedia = isQuotedImage ? JSON.parse(JSON.stringify(fxsx).replace('quotedM','m')).message.extendedTextMessage.contextInfo : fxsx
						const media = await nuy.downloadAndSaveMediaMessage(encmedia)
						ranw = getRandom('.webp')
						ranp = getRandom('.png')
						fakeitem(mess.wait)
						keyrmbg = 'bcAvZyjYAjKkp1cmK8ZgQvWH'
						await removeBackgroundFromImageFile({path: media, apiKey: keyrmbg.result, size: 'auto', type: 'auto', ranp}).then(res => {
							fs.unlinkSync(media)
							let buffer = Buffer.from(res.base64img, 'base64')
							fs.writeFileSync(ranp, buffer, (err) => {
								if (err) return fakeitem(mess.error.Iv)
							})
							exec(`ffmpeg -i ${ranp} -vcodec libwebp -filter:v fps=fps=20 -lossless 1 -loop 0 -preset default -an -vsync 0 -s 512:512 ${ranw}`, (err) => {
								fs.unlinkSync(ranp)
								if (err) return fakeitem(mess.error.Iv)
								buff = fs.readFileSync(ranw)
								nuy.sendMessage(from, buff, sticker, {quoted: fxsx})
							})
						})
					} else {
						fakeitem(`Kirim gambar dengan caption ${prefix}sticker atau tag gambar yang sudah dikirim`)
					}
					break
                case 'trigger':
					if (!isUser) return fakeitem(mess.only.userB)
                    var imgbb = require('imgbb-uploader')
                    if ((isMedia && !fxsx.message.videoMessage || isQuotedImage) && args.length == 0) {
                    encmedia = isQuotedImage ? JSON.parse(JSON.stringify(fxsx).replace('quotedM','m')).message.extendedTextMessage.contextInfo : fxsx
                    media = await nuy.downloadAndSaveMediaMessage(encmedia)
                    anu = await imgbb("3ea1465ef91578a90ee81f7d41c59a1f", media)
                    teks = `${anu.display_url}`
                    ranp = getRandom('.gif')
                    rano = getRandom('.webp')
                    anu1 = `https://some-random-api.ml/canvas/triggered?avatar=${teks}`
                    exec(`wget ${anu1} -O ${ranp} && ffmpeg -i ${ranp} -vcodec libwebp -filter:v fps=fps=20 -lossless 1 -loop 0 -preset default -an -vsync 0 -s 512:512 ${rano}`, (err) => {
                    fs.unlinkSync(ranp)
                    if (err) return fakeitem(mess.error.stick)
                    nobg = fs.readFileSync(rano)
                    nuy.sendMessage(from, nobg, sticker, {quoted: fxsx})
                    fs.unlinkSync(rano)
                    })
                    } else {
                    fakeitem('Gunakan Fotonya')
                    }
                    break
				case 'tts':
				    if (!isUser) return fakeitem(mess.only.userB)
					if (args.length < 1) return fakeitem('Kode Bahasanya?')
					const gtts = require('./lib/gtts')(args[0])
					if (args.length < 2) return fakeitem('Textnya Mana Kak')
					dtt = body.slice(9)
					ranm = getRandom('.mp3')
					rano = getRandom('.ogg')
					dtt.length > 600
					? fakeitem('Textnya Kebanyakan Kak')
					: gtts.save(ranm, dtt, function() {
						exec(`ffmpeg -i ${ranm} -ar 48000 -vn -c:a libopus ${rano}`, (err) => {
							fs.unlinkSync(ranm)
							buff = fs.readFileSync(rano)
							if (err) return fakeitem(mess.error.Iv)
							nuy.sendMessage(from, buff, audio, {quoted: ftroli, ptt:true})
							fs.unlinkSync(rano)
						})
					})
					break
                case 'tomp3':
                    if (!isUser) return fakeitem(mess.only.userB)
                    if (!isQuotedVideo) return fakeitem('Reply videonya!')
                    encmedia = JSON.parse(JSON.stringify(fxsx).replace('quotedM', 'm')).message.extendedTextMessage.contextInfo
                    media = await nuy.downloadAndSaveMediaMessage(encmedia)
                    ran = getRandom('.mp4')
                    exec(`ffmpeg -i ${media} ${ran}`, (err) => {
                    fs.unlinkSync(media)
                    if (err) return fakeitem(`Err: ${err}`)
                    buffer = fs.readFileSync(ran)
                    nuy.sendMessage(from, buffer, MessageType.audio, {quoted: ftroli, mimetype: 'audio/mp4', ptt:false})
                    fs.unlinkSync(ran)
                    })
                    break
                case 'toimg':
                    if (!isUser) return fakeitem(mess.only.userB)
					if (!isQuotedSticker) return fakeitem('Reply Stickernya')
					fakeitem(mess.wait)
					encmedia = JSON.parse(JSON.stringify(fxsx).replace('quotedM','m')).message.extendedTextMessage.contextInfo
					media = await nuy.downloadAndSaveMediaMessage(encmedia)
					ran = getRandom('.png')
					exec(`ffmpeg -i ${media} ${ran}`, (err) => {
						fs.unlinkSync(media)
						if (err) return fakeitem(mess.error.Iv)
						buffer = fs.readFileSync(ran)
						nuy.sendMessage(from, buffer, image, {quoted: ftroli, caption: '>//<'})
						fs.unlinkSync(ran)
					})
					break
                case 'hilih':
                    if (!isUser) return fakeitem(mess.only.userB)
                    if (args.length < 1) return fakeitem('Teksnya mana?')
					anu = await fetchJson(`https://api.zeks.xyz/api/hilihmaker?text=${body.slice(7)}&apikey=apivinz`, {method: 'get'})
					fakeitem(anu.result)
					break
		        case 'holoh':
		            if (!isUser) return fakeitem(mess.only.userB)
		            if (args.length < 1) return fakeitem('Teksnya mana?')
					anu = await fetchJson(`https://a.apimau.ga/vokal?vokal=o&teks=${body.slice(7)}`, {method: 'get'})
					fakeitem(anu.result)
					break
                case 'wait':
                    if (!isUser) return fakeitem(mess.only.userB)
					if ((isMedia && !fxsx.message.videoMessage || isQuotedImage) && args.length == 0) {
						fakeitem(mess.wait)
						const encmedia = isQuotedImage ? JSON.parse(JSON.stringify(fxsx).replace('quotedM','m')).message.extendedTextMessage.contextInfo : fxsx
						media = await nuy.downloadMediaMessage(encmedia)
						await wait(media).then(res => {
							nuy.sendMessage(from, res.video, video, {quoted: ftroli, caption: res.teks.trim()})
						}).catch(err => {
							fakeitem(err)
						})
					} else {
						fakeitem('Foto Aja Kak')
					}
					break
                case 'ocr':
                    if (!isUser) return fakeitem(mess.only.userB)
					if ((isMedia && !fxsx.message.videoMessage || isQuotedImage) && args.length == 0) {
						const encmedia = isQuotedImage ? JSON.parse(JSON.stringify(fxsx).replace('quotedM','m')).message.extendedTextMessage.contextInfo : fxsx
						const media = await nuy.downloadAndSaveMediaMessage(encmedia)
						fakeitem(mess.wait)
						await recognize(media, {lang: 'eng+ind', oem: 1, psm: 3})
							.then(teks => {
								fakeitem(teks.trim())
								fs.unlinkSync(media)
							})
							.catch(err => {
								fakeitem(err.message)
								fs.unlinkSync(media)
							})
					} else {
						fakeitem('Foto Aja Kak')
					}
					break
// End Fun Menu
// Download Menu
				case 'play':
				    if (!isUser) return fakeitem(mess.only.userB)
                    if (args.length == 0) return fakeitem(`Contoh: ${prefix + command} Melukis Senja`)
                    query = args.join(" ")
                    get_result = await fetchJson(`http://api.lolhuman.xyz/api/ytplay?apikey=${LolApi}&query=${query}`)
                    get_result = get_result.result
                    get_info = get_result.info
                    ini_txt = `Judul : ${get_info.title}\n`
                    ini_txt += `Upload : ${get_info.uploader}\n`
                    ini_txt += `Durasi : ${get_info.duration}\n`
                    ini_txt += `Viewers : ${get_info.view}\n`
                    ini_txt += `Like : ${get_info.like}\n`
                    ini_txt += `Dislike : ${get_info.dislike}\n`
                    ini_txt += `Description :\n ${get_info.description}\n`
                    buffer = await getBuffer(get_info.thumbnail)
                    nuy.sendMessage(from, buffer, image, {quoted: fxsx, caption: ini_txt})
                    get_audio = await getBuffer(get_result.audio[3].link)
                    nuy.sendMessage(from, get_audio, audio, { mimetype: 'audio/mp4', filename: `${get_info.title}.mp3`, quoted: ftroli })
                    break
// End Download Menu
// Grup Menu
				case 'tagall':
				    if (!isUser) return fakeitem(mess.only.userB)
					if (!isGroup) return fakeitem(mess.only.group)
					if (!isGroupAdmins) return fakeitem(mess.only.admin)
					members_id = []
					teks = (args.length > 1) ? body.slice(8).trim() : ''
					teks += '\n\n'
					for (let mem of groupMembers) {
						teks += `*#* @${mem.jid.split('@')[0]}\n`
						members_id.push(mem.jid)
					}
					mentions(teks, members_id, true)
					break
				case 'add':
				    if (!isUser) return fakeitem(mess.only.userB)
					if (!isGroup) return fakeitem(mess.only.group)
					if (!isGroupAdmins) return fakeitem(mess.only.admin)
					if (!isBotGroupAdmins) return fakeitem(mess.only.Badmin)
					if (args.length < 1) return fakeitem('Mau Add Siapa Kak')
					if (args[0].startsWith('08')) return fakeitem('Gunakan kode negara')
					try {
						num = `${args[0].replace(/ /g, '')}@s.whatsapp.net`
						nuy.groupAdd(from, [num])
					} catch (e) {
						console.log('Error :', e)
						fakeitem(mess.error.Iv)
					}
					break
				case 'kick':
				    if (!isUser) return fakeitem(mess.only.userB)
					if (!isGroup) return fakeitem(mess.only.group)
					if (!isGroupAdmins) return fakeitem(mess.only.admin)
					if (!isBotGroupAdmins) return fakeitem(mess.only.Badmin)
					if (fxsx.message.extendedTextMessage === undefined || fxsx.message.extendedTextMessage === null) return fakeitem('Tag target yang ingin di tendang!')
					mentioned = fxsx.message.extendedTextMessage.contextInfo.mentionedJid
					if (mentioned.length > 1) {
						teks = 'Perintah di terima, mengeluarkan :\n'
						for (let _ of mentioned) {
							teks += `@${_.split('@')[0]}\n`
						}
						mentions(teks, mentioned, true)
						nuy.groupRemove(from, mentioned)
					} else {
						mentions(`Perintah di terima, mengeluarkan : @${mentioned[0].split('@')[0]}`, mentioned, true)
						nuy.groupRemove(from, mentioned)
					}
					break
				case 'listadmin':
				    if (!isUser) return fakeitem(mess.only.userB)
					if (!isGroup) return fakeitem(mess.only.group)
					teks = `List admin of group *${groupMetadata.subject}*\nTotal : ${groupAdmins.length}\n\n`
					no = 0
					for (let admon of groupAdmins) {
						no += 1
						teks += `[${no.toString()}] @${admon.split('@')[0]}\n`
					}
					mentions(teks, groupAdmins, true)
					break
            case 'totag':
            if ((isMedia && !fxsx.message.videoMessage || isQuotedSticker) && args.length == 0) {
            encmedia = isQuotedSticker ? JSON.parse(JSON.stringify(fxsx).replace('quotedM', 'm')).message.extendedTextMessage.contextInfo : fxsx
            file = await nuy.downloadAndSaveMediaMessage(encmedia, filename = getRandom())
            value = args.join(" ")
            var group = await nuy.groupMetadata(from)
            var member = group['participants']
            var mem = []
            member.map(async adm => {
            mem.push(adm.id.replace('c.us', 's.whatsapp.net'))
            })
            var options = {
                contextInfo: { mentionedJid: mem },
                quoted: fxsx
            }
            ini_buffer = fs.readFileSync(file)
            nuy.sendMessage(from, ini_buffer, sticker, options)
            fs.unlinkSync(file)
            } else if ((isMedia && !fxsx.message.videoMessage || isQuotedImage) && args.length == 0) {
            encmedia = isQuotedImage ? JSON.parse(JSON.stringify(fxsx).replace('quotedM', 'm')).message.extendedTextMessage.contextInfo : fxsx
            file = await nuy.downloadAndSaveMediaMessage(encmedia, filename = getRandom())
            value = args.join(" ")
            var group = await nuy.groupMetadata(from)
            var member = group['participants']
            var mem = []
            member.map(async adm => {
            mem.push(adm.id.replace('c.us', 's.whatsapp.net'))
            })
            var options = {
                contextInfo: { mentionedJid: mem },
                quoted: fxsx
            }
            ini_buffer = fs.readFileSync(file)
            nuy.sendMessage(from, ini_buffer, image, options)
            fs.unlinkSync(file)
        } else if ((isMedia && !fxsx.message.videoMessage || isQuotedAudio) && args.length == 0) {
            encmedia = isQuotedAudio ? JSON.parse(JSON.stringify(fxsx).replace('quotedM', 'm')).message.extendedTextMessage.contextInfo : fxsx
            file = await nuy.downloadAndSaveMediaMessage(encmedia, filename = getRandom())
            value = args.join(" ")
            var group = await nuy.groupMetadata(from)
            var member = group['participants']
            var mem = []
            member.map(async adm => {
            mem.push(adm.id.replace('c.us', 's.whatsapp.net'))
            })
            var options = {
                mimetype : 'audio/mp4',
                ptt : true,
                contextInfo: { mentionedJid: mem },
                quoted: fxsx
            }
            ini_buffer = fs.readFileSync(file)
            nuy.sendMessage(from, ini_buffer, audio, options)
            fs.unlinkSync(file)
        }  else if ((isMedia && !fxsx.message.videoMessage || isQuotedVideo) && args.length == 0) {
            encmedia = isQuotedVideo ? JSON.parse(JSON.stringify(fxsx).replace('quotedM', 'm')).message.extendedTextMessage.contextInfo : fxsx
            file = await nuy.downloadAndSaveMediaMessage(encmedia, filename = getRandom())
            value = args.join(" ")
            var group = await nuy.groupMetadata(from)
            var member = group['participants']
            var mem = []
            member.map(async adm => {
            mem.push(adm.id.replace('c.us', 's.whatsapp.net'))
            })
            var options = {
                mimetype : 'video/mp4',
                contextInfo: { mentionedJid: mem },
                quoted: fxsx
            }
            ini_buffer = fs.readFileSync(file)
            nuy.sendMessage(from, ini_buffer, video, options)
            fs.unlinkSync(file)
        } else{
          fakeitem(`reply gambar/sticker/audio/video dengan caption ${prefix}totag`)
        }
        break
				case 'welcome':
				    if (!isUser) return fakeitem(mess.only.userB)
					if (!isGroup) return fakeitem(mess.only.group)
					if (!isGroupAdmins) return fakeitem(mess.only.admin)
					if (args.length < 1) return fakeitem('On untuk aktifkan, Off untuk nonaktifkan')
					if (Number(args[0]) === 1) {
						if (isWelkom) return fakeitem('Sudah On')
						welkom.push(from)
						fs.writeFileSync('./database/welkom.json', JSON.stringify(welkom))
						fakeitem(mess.success)
					} else if (Number(args[0]) === 0) {
					    if (isWelkom) return fakeitem('Sudah Off')
						welkom.splice(from, 1)
						fs.writeFileSync('./database/welkom.json', JSON.stringify(welkom))
						fakeitem(mess.success)
					} else {
						fakeitem('On untuk aktifkan, Off untuk nonaktifkan')
					}
					break
// End Grup Menu
// Khusus Owner
                case 'public':
                    if (!isOwner && !fxsx.key.fromMe) return fakeitem(mess.only.ownerB)
				    public = true
				    fakeitem('STATUS : PUBLIC')
				    break
                case 'setprefix':
				    if (!isOwner && !fxsx.key.fromMe) return fakeitem(mess.only.ownerB)
					prefix = args.join(" ")
					fakeitem(`Menjadi : ${prefix}`)
					break
                case 'setfname':
                    if (!isOwner && !fxsx.key.fromMe) return fakeitem(mess.only.ownerB)
					namabot = args.join(" ")
					fakeitem(`Menjadi : ${namabot}`)
					break
                case 'clearchat':
                case 'clearall':
					if (!isOwner && !fxsx.key.fromMe) return fakeitem(mess.only.ownerB)
					anu = await nuy.chats.all()
					nuy.setMaxListeners(25)
					for (let _ of anu) {
						nuy.deleteChat(_.jid)
					}
					fakeitem(mess.success)
					break
				case 'bc':
					if (!isOwner && !fxsx.key.fromMe) return fakeitem(mess.only.ownerB)
					if (args.length < 1) return fakeitem('Textnya Mana?')
					anu = await nuy.chats.all()
					if (isMedia && !fxsx.message.videoMessage || isQuotedImage) {
						const encmedia = isQuotedImage ? JSON.parse(JSON.stringify(fxsx).replace('quotedM','m')).message.extendedTextMessage.contextInfo : fxsx
						buff = await nuy.downloadMediaMessage(encmedia)
						for (let _ of anu) {
							nuy.sendMessage(_.jid, buff, image, {caption: `[ BC BY OWNER ]\n\n${body.slice(4)}`})
						}
						fakeitem(mess.success)
					} else {
						for (let _ of anu) {
							sendMess(_.jid, `[ BC BY OWNER ]\n\n${body.slice(4)}`)
						}
						fakeitem(mess.success)
					}
					break
                case 'clone':
                    if (!isOwner && !fxsx.key.fromMe) return fakeitem(mess.only.ownerB)
					if (!isGroup) return fakeitem(mess.only.group)
					if (!isGroupAdmins) return fakeitem(mess.only.admin)
					if (args.length < 1) return fakeitem('Tag Orang Nya')
					if (fxsx.message.extendedTextMessage === undefined || fxsx.message.extendedTextMessage === null) return fakeitem('Tag cvk')
					mentioned = fxsx.message.extendedTextMessage.contextInfo.mentionedJid[0]
					let { jid, id, notify } = groupMembers.find(x => x.jid === mentioned)
					try {
						pp = await nuy.getProfilePicture(id)
						buffer = await getBuffer(pp)
						nuy.updateProfilePicture(botNumber, buffer)
						mentions(`Foto profile Berhasil di perbarui menggunakan foto profile @${id.split('@')[0]}`, [jid], true)
					} catch (e) {
						fakeitem(mess.error.Iv)
					}
					break
// End Khusus Owner
                case 'pinkyca':
					nuy.updatePresence(from, Presence.composing)
					if (isUser) return fakeitem('*Kamu Sudah Jadi User Pinky*')
					user.push(sender)
					fs.writeFileSync('./database/user.json', JSON.stringify(user))
					try {
					ppca = await nuy.getProfilePicture(`${sender.split('@')[0]}@s.whatsapp.net`)
					} catch {
					ppca = 'https://i0.wp.com/www.gambarunik.id/wp-content/uploads/2019/06/Top-Gambar-Foto-Profil-Kosong-Lucu-Tergokil-.jpg'
					}
					capinky = `╭─✿➤「 *PENDAFTARAN* 」\n│\n│♡ۣۜۜ፝͜͜͡͡✿➤ Berhasil Dengan Sn\n│♡ۣۜۜ፝͜͜͡͡✿➤ TM08GK8PPHBSJDH10J\n│\n│♡ۣۜۜ፝͜͜͡͡✿➤ Pada ${time}\n│♡ۣۜۜ፝͜͜͡͡✿➤ Nama : ${pushname}\n│♡ۣۜۜ፝͜͜͡͡✿➤ Nomer : wa.me/${sender.split('@')[0]}\n│♡ۣۜۜ፝͜͜͡͡✿➤ Total User : ${user.length} Orang\n│\n│♡ۣۜۜ፝͜͜͡͡✿➤ Untuk Menggunakan Pinky Bot\n│♡ۣۜۜ፝͜͜͡͡✿➤ Ketik : ${prefix}menu\n│\n│♡ۣۜۜ፝͜͜͡͡✿➤ note\n│♡ۣۜۜ፝͜͜͡͡✿➤ Jangan Spam Bot Vc/Tlpn!!\n╰─────────────────────`
                    daftarca = await getBuffer(ppca)
					nuy.sendMessage(from, daftarca, image, {quoted: ftroli, caption: capinky})
					break
                case 'owner':
                    nuy.sendMessage(from, {displayname: "nuy", vcard: vcard}, MessageType.contact, {quoted: ftroli})
                    break
				default:
               }
		} catch (e) {
			console.log('Error : %s', color(e, 'red'))
		}
	})
}
starts()
