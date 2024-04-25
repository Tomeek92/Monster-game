function getRandomValue(max, min) {
	return Math.floor(Math.random() * (max - min)) + min
}

const app = Vue.createApp({
	data() {
		return {
			playerHealth: 100,
			monsterHealth: 100,
			currentRound: 0,
			winner: null,
			logMessages: [],
		}
	},
	computed: {
		monsterBarStyles() {
			if (this.monsterHealth < 0) {
				return { width: '0%' }
			}
			return { width: this.monsterHealth + '%' }
		},
		playerBarStyles() {
			if (this.playerHealth < 0) {
				return { width: '0%' }
			}
			return { width: this.playerHealth + '%' }
		},
		specialBlock() {
			return this.currentRound % 3 !== 0
		},
		specialHealthBlock() {
			return this.currentRound % 2 !== 0
		},
	},
	watch: {
		playerHealth(value) {
			if (value <= 0 && this.monsterHealth <= 0) {
				this.winner = 'draw'
			} else if (value <= 0) {
				this.winner = 'monster'
			}
		},
		monsterHealth(value) {
			if (value <= 0 && this.playerHealth <= 0) {
				this.winner = 'draw'
			} else if (value <= 0) {
				this.winner = 'player'
			}
		},
	},
	methods: {
		surrender() {
			this.winner = 'monster'
		},
		startGame() {
			;(this.playerHealth = 100),
				(this.monsterHealth = 100),
				(this.currentRound = 0),
				(this.winner = null),
				(this.logMessages = [])
		},
		attackMonster() {
			this.currentRound++
			const attackValue = getRandomValue(12, 5)
			this.monsterHealth -= attackValue
			this.addLogMessage('player', 'attack', attackValue)
			this.attackPlayer()
		},
		attackPlayer() {
			const attackValue = getRandomValue(15, 6)
			this.addLogMessage('monster', 'attack', attackValue)
			this.playerHealth -= attackValue
		},
		specialAttack() {
			this.currentRound++
			const attackSpecialValue = getRandomValue(20, 10)
			this.monsterHealth -= attackSpecialValue
			this.addLogMessage('player', 'special-attack', attackSpecialValue)
			this.attackPlayer()
		},
		healthUp() {
			this.currentRound++
			const healthPlayerUp = getRandomValue(17, 10)
			if (this.playerHealth + healthPlayerUp > 100) {
				this.playerHealth = 100
			} else {
				this.playerHealth += healthPlayerUp
			}
			this.addLogMessage('player', 'heal', healthPlayerUp)
			this.attackPlayer()
		},
		addLogMessage(who, what, value) {
			this.logMessages.unshift({
				actionBy: who,
				actionType: what,
				actionValue: value,
			})
		},
	},
})

app.mount('#game')
