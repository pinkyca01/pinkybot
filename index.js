/**
* Originally By FxSx
* Recoded By NuyFaa
**/
const {
   WAConnection,
   MessageType,
   Presence,
   MessageOptions,
   Mimetype,
   WALocationMessage,
   WA_MESSAGE_STUB_TYPES,
   ReconnectMode,
   ProxyAgent,
   GroupSettingChange,
   waChatKey
   mentionedJid,
   processTime,
} = require("@adiwajshing/baileys")
const qrcode = require("qrcode-terminal")
const moment = require("moment-timezone")
const fs = require("fs")
const imageToBase64 = require('image-to-base64')
const axios = require('axios')
const fetch = require('node-fetch')
const ffmpeg = require('fluent-ffmpeg')
const lolis = require('lolis.life')
const loli = new lolis()
const Exif = require('./lib/exif')
const exif = new Exif()
const { color, bgcolor } = require('./lib/color')
const { fetchJson } = require('./lib/fetcher')
const { wait, getBuffer, h2k, generateMessageID, getGroupAdmins, getRandom, banner, start, info, success, close } = require('./lib/functions')
const { exec } = require("child_process")
const { removeBackgroundFromImageFile } = require('remove.bg')

public = false
prefix = '#'
freply = 'Pinky Bot'
ator = 'By'
namo = 'Pinky;'

const ownerNumber = ["6283899137143@s.whatsapp.net"]

// Database
const welcome = JSON.parse(fs.readFileSync('./database/welcome.json'))
// End Database

// Connect Qr
 async function starts() {
   const nuy = new WAConnection()
      nuy.version = [2, 2119, 6]
      nuy.on('qr', qr => {
      qrcode.generate(qr, { small: true })
      console.log(color('[','white'),color('∆','red'),color(']','white'),color('QR code ready...','white'),color('FxSx','red'),color('&','lime'),color('NuyFaa','red'))
   })

   nuy.on('credentials-updated', () => {
      const authInfo = nuy.base64EncodedAuthInfo()
      console.log(`credentials updated!`)
      fs.writeFileSync('./pinky.json', JSON.stringify(authInfo, null, '\t'))
   })
   fs.existsSync('./pinky.json') && nuy.loadAuthInfo('./pinky.json')
   nuy.connect();
// End Connect Qr


  nuy.on('group-participants-update', async (anu) => {
		if (!welcome.includes(anu.jid)) return
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
            loli = fs.readFileSync('./mp3/welcome.mp3')
            teks = `*Hallo* @${num.split('@')[0]}\nSelamat datang di group *${mdata.subject}*\nJangan rusuh ya\nJangan lupa intro @${num.split('@')[0]} 🗣`
	        buffer = await getBuffer(`http://hadi-api.herokuapp.com/api/card/welcome2?nama=${encodeURIComponent(anu_user.notify)}&descriminator=${member}&memcount=${member}&gcname=${encodeURIComponent(mdata.subject)}&gcicon=${pp_grup}&pp=${pp_user}&bg=${pp_grup}`)
		    nuy.sendMessage(mdata.id, buffer, MessageType.image, {quoted: {key : {participant : '0@s.whatsapp.net'}, message: {orderMessage: {itemCount : 1, status: 1, surface : 1, message: `Welcome @${num.split('@')[0]}`, orderTitle: `Welcome @${num.split('@')[0]}`, thumbnail: fs.readFileSync('pinky.jpg'), sellerJid: '0@s.whatsapp.net'} } }, contextInfo: {"mentionedJid": [num]}, caption: teks})
            nuy.sendMessage(mdata.id, loli, MessageType.audio, {quoted: caa, mimetype: 'audio/mp4', ptt:true, contextInfo: {"mentionedJid": [num]}, duration:9999})
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
  
  const hour_now = moment().format('HH')
        var ucapanWaktu = 'Selamat Pagi🌄'
        if (hour_now >= '03' && hour_now <= '10') {
          ucapanWaktu = 'Selamat Pagi🌅'
        } else if (hour_now >= '10' && hour_now <= '14') {
          ucapanWaktu = 'Selamat Siang🌞'
        } else if (hour_now >= '14' && hour_now <= '17') {
          ucapanWaktu = 'Selamat Sore☀️'
        } else if (hour_now >= '17' && hour_now <= '18') {
          ucapanWaktu = 'Selamat Sore☀️'
        } else if (hour_now >= '18' && hour_now <= '23') {
          ucapanWaktu = 'Selamat Malam🌌'
        } else {
          ucapanWaktu = 'Selamat Malam🌌'
        }

  nuy.on('message-new', async (caa) => {
		try {
			if (!caa.message) return
			if (caa.key && caa.key.remoteJid == 'status@broadcast') return
			
			global.prefix
			const content = JSON.stringify(caa.message)
			const from = caa.key.remoteJid
			const type = Object.keys(caa.message)[0]
			const { text, extendedText, contact, location, liveLocation, image, video, sticker, document, audio, product } = MessageType
            const time = moment().tz('Asia/Jakarta').format("HH:mm:ss")
            body = (type === 'conversation' && caa.message.conversation.startsWith(prefix)) ? caa.message.conversation : (type == 'imageMessage') && caa.message.imageMessage.caption.startsWith(prefix) ? caa.message.imageMessage.caption : (type == 'videoMessage') && caa.message.videoMessage.caption.startsWith(prefix) ? caa.message.videoMessage.caption : (type == 'extendedTextMessage') && caa.message.extendedTextMessage.text.startsWith(prefix) ? caa.message.extendedTextMessage.text : ''
            chatca = (type === 'conversation') ? caa.message.conversation : (type === 'extendedTextMessage') ? caa.message.extendedTextMessage.text : ''
            const command = body.slice(1).trim().split(/ +/).shift().toLowerCase()
		    const args = body.trim().split(/ +/).slice(1)
		    const isCmd = body.startsWith(prefix)
		    const arg = chatca.slice(command.length + 2, chatca.length)
		    const q = args.join(' ')
		    const botNumber = nuy.user.jid
		    const isGroup = from.endsWith('@g.us')
	    	const sender = caa.key.fromMe ? nuy.user.jid : isGroup ? caa.participant : caa.key.remoteJid
		    pushname = nuy.contacts[sender] != undefined ? nuy.contacts[sender].vname || nuy.contacts[sender].notify : undefined
		    const totalchat = await nuy.chats.all()
		    const groupMetadata = isGroup ? await nuy.groupMetadata(from) : ''
		    const groupName = isGroup ? groupMetadata.subject : ''
		    const groupId = isGroup ? groupMetadata.jid : ''
		    const groupMembers = isGroup ? groupMetadata.participants : ''
		    const groupDesc = isGroup ? groupMetadata.desc : ''
		    const groupAdmins = isGroup ? getGroupAdmins(groupMembers) : ''
		    const mentionByTag = type == "extendedTextMessage" && caa.message.extendedTextMessage.contextInfo != null ? caa.message.extendedTextMessage.contextInfo.mentionedJid : []
			const mentionByReply = type == "extendedTextMessage" && caa.message.extendedTextMessage.contextInfo != null ? caa.message.extendedTextMessage.contextInfo.participant || "" : ""
			const mention = typeof(mentionByTag) == 'string' ? [mentionByTag] : mentionByTag
			mention != undefined ? mention.push(mentionByReply) : []
			const mentionUser = mention != undefined ? mention.filter(n => n) : []
		    
		    const isWelcome = isGroup ? welcome.includes(from) : false
            const isGroupAdmins = groupAdmins.includes(sender) || false
            const isOwner = ownerNumber.includes(sender)
		    const itsCa = sender === botNumber ? true : false
		    const isUrl = (url) => {
			return url.match(new RegExp(/https?:\/\/(www\.)?[-a-zA-Z0-9@:%.+~#=]{1,256}\.[a-zA-Z0-9()]{1,6}\b([-a-zA-Z0-9()@:%+.~#?&/=]*)/, 'gi'))
		    }
		    const reply = (teks) => {
				nuy.sendMessage(from, teks, text, {quoted:caa})
			}
			const sendMess = (hehe, teks) => {
				nuy.sendMessage(hehe, teks, text)
			}
			const mentions = (teks, memberr, id) => {
				(id == null || id == undefined || id == false) ? nuy.sendMessage(from, teks.trim(), extendedText, {contextInfo: {"mentionedJid": memberr}}) : nuy.sendMessage(from, teks.trim(), extendedText, {quoted: caa, contextInfo: {"mentionedJid": memberr}})
			}
			const sendImage = (teks) => {
		    nuy.sendMessage(from, teks, image, {quoted:caa})
		    }
		    const costum = (pesan, tipe, target, target2) => {
			nuy.sendMessage(from, pesan, tipe, {quoted: { key: { fromMe: false, participant: `${target}`, ...(from ? { remoteJid: from } : {}) }, message: { conversation: `${target2}` }}})
			}
		    const sendPtt = (teks) => {
		    nuy.sendMessage(from, audio, mp3, {quoted:caa})
		    }
		    
            function addMetadata(packname, author) {	
	        if (!packname) packname = 'MancaBot'; if (!author) author = 'NuyFaa';	
	        author = author.replace(/[^a-zA-Z0-9]/g, '');	
	        let name = `${author}_${packname}`
	        if (fs.existsSync(`./${name}.exif`)) return `./${name}.exif`
	        const json = {	
		         "sticker-pack-name": packname,
		         "sticker-pack-publisher": author,
	        }
        	const littleEndian = Buffer.from([0x49, 0x49, 0x2A, 0x00, 0x08, 0x00, 0x00, 0x00, 0x01, 0x00, 0x41, 0x57, 0x07, 0x00])	
        	const bytes = [0x00, 0x00, 0x16, 0x00, 0x00, 0x00]	

        	let len = JSON.stringify(json).length	
        	let last	

        	if (len > 256) {	
        		len = len - 256	
        		bytes.unshift(0x01)	
        	} else {	
        		bytes.unshift(0x00)	
        	}	

        	if (len < 16) {	
        		last = len.toString(16)	
         		last = "0" + len	
        	} else {	
        		last = len.toString(16)	
        	}	

            if (!isOwner) {
				prema = 'Owner'
			}
			
        	const buf2 = Buffer.from(last, "hex")	
        	const buf3 = Buffer.from(bytes)	
         	const buf4 = Buffer.from(JSON.stringify(json))	

        	const buffer = Buffer.concat([littleEndian, buf2, buf3, buf4])	

        	fs.writeFile(`./${name}.exif`, buffer, (err) => {	
        		return `./${name}.exif`	
        	})	

         }
		    
            const isMedia = (type === 'imageMessage' || type === 'videoMessage')
			const isQuotedImage = type === content.includes('imageMessage')
			const isQuotedVideo = type === content.includes('videoMessage')
			const isQuotedAudio = type === content.includes('audioMessage')
			const isQuotedSticker = type === content.includes('stickerMessage')
		    if (itsCa){
			if (chatca.toLowerCase() === `${prefix}self`){
			if (!isOwner) return nuy.sendMessage(from, '「 KHUSUS OWNER 」',MessageType.text, { quoted: caa, contextInfo: { forwardingScore: 999, isForwarded: true}})
				public = false
				reply('Sukses')
			}
			if (chatca.toLowerCase() === 'status'){
				reply(`STATUS: ${public ? 'PUBLIC' : 'SELF'}`)
			}
		}
		if (!public){
			if (!caa.key.fromMe) return
		}
		if (isCmd && !isGroup) {console.log(color('[CMD]'), color(moment(caa.messageTimestamp * 1000).format('DD/MM/YY HH:mm:ss'), 'yellow'), color(`${command} [${args.length}]`))}
        if (isCmd && isGroup) {console.log(color('[CMD]'), color(moment(caa.messageTimestamp * 1000).format('DD/MM/YY HH:mm:ss'), 'yellow'), color(`${command} [${args.length}]`), 'from', color(nuy.user.name), 'in', color(groupName))}
        switch (command) {
        case 'menu': case 'help':
                   let pinky = nuy.prepareMessageFromContent(from, {
					"listMessage": {
						"title": "⌜ PINKY MENU ⌟",
						"description": `${ucapanWaktu}`,
						"buttonText": "Pinky Menu",
						"listType": "SINGLE_SELECT",
						"sections": [
							{
								"title": "Pilih Salah Satu Kak",
								"rows": [
									{
										"title": `${prefix}stickermenu`,
										"rowId": "1 Fitur"
									},
									{
										"title": `${prefix}groupmenu`,
										"rowId": "1 Fitur"
									},
									{
										"title": `${prefix}ownermenu`,
										"rowId": "6 Fitur"
									}
									{
										"title": `${prefix}infomenu`,
										"rowId": "1 Fitur"
									}
								  ]
							   }
						     ]
	                }}, {})
                  nuy.sendMessage(pinky, {waitForAck: true})
                  break
        case 'ownermenu':
          menuow = `⌜ PINKY SELF ⌟

${ucapanWaktu}
${pushname}

⌜ OWNER MENU ⌟

${prefix}public
${prefix}self
${prefix}setprefix
${prefix}setfreply
${prefix}setfoto
${prefix}colong

⌜ BASE FXSX ⌟`
          nuy.sendMessage(from, menuow, MessageType.text, { quoted: caa, contextInfo: { forwardingScore: 508, isForwarded: true}})
          break
          case 'stickermenu':
          menustick = `⌜ PINKY SELF ⌟

${ucapanWaktu}
${pushname}

⌜ STICKER MENU ⌟

${prefix}sticker

⌜ BASE FXSX ⌟`
          nuy.sendMessage(from, menustick, MessageType.text, { quoted: caa, contextInfo: { forwardingScore: 508, isForwarded: true}})
          break
      case 'groupmenu':
          menugc = `⌜ PINKY SELF ⌟

${ucapanWaktu}
${pushname}

⌜ GROUP MENU ⌟

${prefix}getpic
${prefix}welcome

⌜ BASE FXSX ⌟`
          nuy.sendMessage(from, menugc, MessageType.text, { quoted: caa, contextInfo: { forwardingScore: 508, isForwarded: true}})
          break
case 'groupmenu':
          menuinfo = `⌜ PINKY SELF ⌟

${ucapanWaktu}
${pushname}

⌜ INFO MENU ⌟

${prefix}owner

⌜ BASE FXSX ⌟`
          nuy.sendMessage(from, menuinfo, MessageType.text, { quoted: caa, contextInfo: { forwardingScore: 508, isForwarded: true}})
          break
// Owner Menu
        case 'public':
                if (!isOwner) return nuy.sendMessage(from, '「 KHUSUS OWNER 」',MessageType.text, { quoted: caa, contextInfo: { forwardingScore: 999, isForwarded: true}})
				public = true
				nuy.sendMessage(from, 'Status: PUBLIC', MessageType.text, {quoted: caa})
				break
        case 'setprefix':
                if (!isOwner) return nuy.sendMessage(from, '「 KHUSUS OWNER 」',MessageType.text, { quoted: caa, contextInfo: { forwardingScore: 999, isForwarded: true}})
                if (!arg) return reply(from, `Ketik ${prefix}setprefix !`)
				prefix = arg
				nuy.sendMessage(from, `Sukses Menjadi ${prefix}`,MessageType.text, {quoted: caa})
				break
        case 'setfreply':
                if (!isOwner) return nuy.sendMessage(from, '「 KHUSUS OWNER 」',MessageType.text, { quoted: caa, contextInfo: { forwardingScore: 999, isForwarded: true}})
                if (!arg) return reply(from, `Ketik ${prefix}setfreply ......`)
				freply = arg
				nuy.sendMessage(from, `Sukses Menjadi ${freply}`,MessageType.text, {quoted: caa})
				break
        case 'setwms': case 'setwmsticker': 
                if (!isOwner) return nuy.sendMessage(from, '「 KHUSUS OWNER 」',MessageType.text, { quoted: caa, contextInfo: { forwardingScore: 999, isForwarded: true}})
                if (args.length < 1) return reply(from, `Ketik ${prefix}setwms nama|author`)
		        ini_pinky = args.join(" ").split("|")
			    namo = ini_pinky[0].trim()
			    ator = ini_pinky[1].trim()
				nuy.sendMessage(from, `Sukses Menjadi ${namo} • ${ator}`,MessageType.text, {quoted: caa})
				break
        case 'setfoto': case 'setthumb':
				if (!isOwner) return nuy.sendMessage(from, '「 KHUSUS OWNER 」',MessageType.text, { quoted: caa, contextInfo: { forwardingScore: 999, isForwarded: true}})
				nuyfaa = JSON.parse(JSON.stringify(caa).replace('quotedM', 'm')).message.extendedTextMessage.contextInfo
				nuyca = await nuy.downloadMediaMessage(nuyfaa)
				fs.writeFileSync(`pinky.jpg`, nuyca)
				nuy.sendMessage(from, 'Sukses Beb😉',MessageType.text, { quoted: caa, contextInfo: { forwardingScore: 999, isForwarded: true}, sendEphemeral: true, thumbnail: fs.readFileSync('pinky.jpg', 'base64')})
				break
// Sticker Menu
        case 'sticker': case 'stiker':
		case 'stick': case 's':
					if ((isMedia && !caa.message.videoMessage || isQuotedImage) && args.length == 0) {
						const encmedia = isQuotedImage ? JSON.parse(JSON.stringify(caa).replace('quotedM','m')).message.extendedTextMessage.contextInfo : caa
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
								reply(ind.stikga)
							})
							.on('end', function () {
								console.log('Finish')
								exec(`webpmux -set exif ${addMetadata(namo, ator)} ${ran} -o ${ran}`, async (error) => {
									nuy.sendMessage(from, fs.readFileSync(ran), sticker, {quoted: caa, sendEphemeral: true, thumbnail: fs.readFileSync('pinky.jpg', 'base64')})
									fs.unlinkSync(media)	
									fs.unlinkSync(ran)	
								})
							})
							.addOutputOptions([`-vcodec`,`libwebp`,`-vf`,`scale='min(320,iw)':min'(320,ih)':force_original_aspect_ratio=decrease,fps=15, pad=320:320:-1:-1:color=white@0.0, split [a][b]; [a] palettegen=reserve_transparent=on:transparency_color=ffffff [p]; [b][p] paletteuse`])
							.toFormat('webp')
							.save(ran)
					} else if ((isMedia && caa.message.videoMessage.seconds < 11 || isQuotedVideo && caa.message.extendedTextMessage.contextInfo.quotedMessage.videoMessage.seconds < 11) && args.length == 0) {
						const encmedia = isQuotedVideo ? JSON.parse(JSON.stringify(caa).replace('quotedM','m')).message.extendedTextMessage.contextInfo : caa
						const media = await nuy.downloadAndSaveMediaMessage(encmedia)
						ran = getRandom('.webp')
						await ffmpeg(`./${media}`)
							.inputFormat(media.split('.')[1])
							.on('start', function (cmd) {
								console.log(`Started : ${cmd}`)
							})
							.on('error', function (err) {
								console.log(`Error : ${err}`)
								fs.unlinkSync(media)
								tipe = media.endsWith('.mp4') ? 'video' : 'gif'
								reply(` Gagal, pada saat mengkonversi ${tipe} ke stiker`)
							})
							.on('end', function () {
								console.log('Finish')
								exec(`webpmux -set exif ${addMetadata(namo, ator)} ${ran} -o ${ran}`, async (error) => {
									nuy.sendMessage(from, fs.readFileSync(ran), sticker, {quoted: caa, sendEphemeral: true, thumbnail: fs.readFileSync('pinky.jpg', 'base64')})
									fs.unlinkSync(media)
									fs.unlinkSync(ran)
								})
							})
							.addOutputOptions([`-vcodec`,`libwebp`,`-vf`,`scale='min(320,iw)':min'(320,ih)':force_original_aspect_ratio=decrease,fps=15, pad=320:320:-1:-1:color=white@0.0, split [a][b]; [a] palettegen=reserve_transparent=on:transparency_color=ffffff [p]; [b][p] paletteuse`])
							.toFormat('webp')
							.save(ran)
					} else {
						reply(`Kirim gambar dengan caption ${prefix}sticker atau tag gambar yang sudah dikirim`)
					}
					break
        case 'ambil': case 'colong':
                    if (!isOwner) return nuy.sendMessage(from, '「 KHUSUS OWNER 」',MessageType.text, { quoted: caa, contextInfo: { forwardingScore: 999, isForwarded: true}})
					if ((isMedia && !caa.message.videoMessage || isQuotedSticker) && args.length == 0) {
						const encmedia = isQuotedSticker ? JSON.parse(JSON.stringify(caa).replace('quotedM','m')).message.extendedTextMessage.contextInfo : caa
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
							})
							.on('end', function () {
								console.log('Finish')
								exec(`webpmux -set exif ${addMetadata(namo, ator)} ${ran} -o ${ran}`, async (error) => {
									nuy.sendMessage(from, fs.readFileSync(ran), sticker, { quoted: caa })
									fs.unlinkSync(media)	
									fs.unlinkSync(ran)	
								})
							})
							.addOutputOptions([`-vcodec`,`libwebp`,`-vf`,`scale='min(320,iw)':min'(320,ih)':force_original_aspect_ratio=decrease,fps=15, pad=320:320:-1:-1:color=white@0.0, split [a][b]; [a] palettegen=reserve_transparent=on:transparency_color=ffffff [p]; [b][p] paletteuse`])
							.toFormat('webp')
							.save(ran)
					} else if ((isMedia && caa.message.videoMessage.seconds < 99 || isQuotedVideo && caa.message.extendedTextMessage.contextInfo.quotedMessage.videoMessage.seconds < 99) && args.length == 0) {
						const encmedia = isQuotedVideo ? JSON.parse(JSON.stringify(caa).replace('quotedM','m')).message.extendedTextMessage.contextInfo : caa
						const media = await nuy.downloadAndSaveMediaMessage(encmedia)
						ran = getRandom('.webp')
						await ffmpeg(`./${media}`)
							.inputFormat(media.split('.')[1])
							.on('start', function (cmd) {
								console.log(`Started : ${cmd}`)
							})
							.on('error', function (err) {
								console.log(`Error : ${err}`)
								fs.unlinkSync(media)
								tipe = media.endsWith('.mp4') ? 'video' : 'gif'
								nuy.sendMessage(from, `Gagal, pada saat mengkonversi ${tipe} ke stiker`,MessageType.text, { quoted: caa, contextInfo: { forwardingScore: 508, isForwarded: true}})
							})
							.on('end', function () {
								console.log('Finish')
								exec(`webpmux -set exif ${addMetadata(namo, ator)} ${ran} -o ${ran}`, async (error) => {
									nuy.sendMessage(from, fs.readFileSync(ran), sticker, { quoted: fgif })
									fs.unlinkSync(media)
									fs.unlinkSync(ran)
								})
							})
							.addOutputOptions([`-vcodec`,`libwebp`,`-vf`,`scale='min(320,iw)':min'(320,ih)':force_original_aspect_ratio=decrease,fps=15, pad=320:320:-1:-1:color=white@0.0, split [a][b]; [a] palettegen=reserve_transparent=on:transparency_color=ffffff [p]; [b][p] paletteuse`])
							.toFormat('webp')
							.save(ran)
					} else if ((isMedia || isQuotedSticker) && args[0] == 'nobg') {
						const encmedia = isQuotedSticker ? JSON.parse(JSON.stringify(caa).replace('quotedM','m')).message.extendedTextMessage.contextInfo : caa
						const media = await nuy.downloadAndSaveMediaMessage(encmedia)
						ranw = getRandom('.webp')
						ranp = getRandom('.png')
						keyrmbg = 'bcAvZyjYAjKkp1cmK8ZgQvWH'
						await removeBackgroundFromImageFile({path: media, apiKey: keyrmbg, size: 'auto', type: 'auto', ranp}).then(res => {
							fs.unlinkSync(media)
							let buffer = Buffer.from(res.base64img, 'base64')
							fs.writeFileSync(ranp, buffer, (err) => {
								if (err) return nuy.sendMessage(from, 'Gagal, Terjadi kesalahan, silahkan coba beberapa saat lagi',MessageType.text, { quoted: caa, contextInfo: { forwardingScore: 508, isForwarded: true}})
							})
							exec(`ffmpeg -i ${ranp} -vcodec libwebp -filter:v fps=fps=20 -lossless 1 -loop 0 -preset default -an -vsync 0 -s 512:512 ${ranw}`, (err) => {
								fs.unlinkSync(ranp)
								exec(`webpmux -set exif ${addMetadata(namo, ator)} ${ranw} -o ${ranw}`, async (error) => {
									nuy.sendMessage(from, fs.readFileSync(ranw), sticker, { quoted: caa })
									fs.unlinkSync(ranw)
								})
							})
						})
					} else {
						nuy.sendMessage(from, `Reply sticker dengan caption ${prefix}colong`,MessageType.text, { quoted: caa, contextInfo: { forwardingScore: 508, isForwarded: true}})
					}
					break
// Info Menu
        case 'owner':
               nuy.sendMessage(from, `${pushname} Hayo Mau Ngapain\nCari Owner Bot Ini?`,MessageType.text, { quoted: caa, contextInfo: { forwardingScore: 508, isForwarded: true}})
               break
// Group Menu
        case 'getpic': case 'getfotomem':
		        if (!isGroup) return nuy.sendMessage(from, '「 KHUSUS GROUP 」',MessageType.text, { quoted: caa, contextInfo: { forwardingScore: 508, isForwarded: true}, sendEphemeral: true, thumbnail: fs.readFileSync('pinky.jpg', 'base64')})
				if (caa.message.extendedTextMessage != undefined){
					mentioned = nuy.message.extendedTextMessage.contextInfo.mentionedJid
					try {
						pic = await nuy.getProfilePicture(mentioned[0])
					} catch {
						pic = 'https://i.ibb.co/Tq7d7TZ/age-hananta-495-photo.png'
					}
					thumb = await getBuffer(pic)
					nuy.sendMessage(from, thumb, MessageType.image)
				{quoted : caa }}
				break
        case 'welcome':
                if (!isGroup) return nuy.sendMessage(from, '「 KHUSUS GROUP 」',MessageType.text, { quoted: caa, contextInfo: { forwardingScore: 508, isForwarded: true}, sendEphemeral: true, thumbnail: fs.readFileSync('pinky.jpg', 'base64')})
				if (!isGroupAdmins) return nuy.sendMessage(from, '「 KHUSUS ADMIN 」',MessageType.text, { quoted: caa, contextInfo: { forwardingScore: 508, isForwarded: true}, sendEphemeral: true, thumbnail: fs.readFileSync('pinky.jpg', 'base64')})
			    if (args.length < 1) return nuy.sendMessage(from, 'Mengaktifkan Ketik On, Menonaktif Ketik Off',MessageType.text, { quoted: caa, contextInfo: { forwardingScore: 508, isForwarded: true}, sendEphemeral: true, thumbnail: fs.readFileSync('pinky.jpg', 'base64')})
			    if (args[0] === 'on') {
					if (isWelcome) return nuy.sendMessage(from, '*Fitur welcome sudah aktif sebelum nya',MessageType.text, { quoted: caa, contextInfo: { forwardingScore: 508, isForwarded: true}, sendEphemeral: true, thumbnail: fs.readFileSync('pinky.jpg', 'base64')})
					welcome.push(from)
					fs.writeFileSync('./database/welcome.json', JSON.stringify(welcome))
					nuy.sendMessage(from, '❬ SUCCSESS ❭ mengaktifkan fitur welcome di group ini',MessageType.text, { quoted: caa, contextInfo: { forwardingScore: 508, isForwarded: true}, sendEphemeral: true, thumbnail: fs.readFileSync('pinky.jpg', 'base64')})
				} else if (args[0] === 'off') {
					welcome.splice(from, 1)
					fs.writeFileSync('./database/welcome.json', JSON.stringify(welcome))
					nuy.sendMessage(from, '❬ SUCCSESS ❭ menonaktifkan fitur welcome di group ini',MessageType.text, { quoted: caa, contextInfo: { forwardingScore: 508, isForwarded: true}, sendEphemeral: true, thumbnail: fs.readFileSync('pinky.jpg', 'base64')})
				} else {
					nuy.sendMessage(from, 'on untuk menyalakan, off untuk mematikan',MessageType.text, { quoted: caa, contextInfo: { forwardingScore: 508, isForwarded: true}, sendEphemeral: true, thumbnail: fs.readFileSync('pinky.jpg', 'base64')})
				}
				break
          default:
          if (body.startsWith(`${prefix}${command}`)) {
              const loli = fs.readFileSync('./mp3/tidakada.mp3')
              nuy.sendMessage(from, loli, MessageType.audio, {quoted: caa, mimetype: 'audio/mp4', ptt:true, duration:9999})
              }
          }
	 } catch (e) {
		 console.log('Error : %s', color(e, 'red'))
	 }
  })
}
starts()