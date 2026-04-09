<script lang="ts" setup>
import {computed, ref} from 'vue'

const currentUrl = ref('https://www.bing.com')
const history = ref(['https://www.bing.com'])
const historyIndex = ref(0)
const urlInput = ref('https://www.bing.com')

const favorites = [
  {name: 'Instagram', url: 'https://www.instagram.com', icon: 'skill-icons:instagram'},
  {name: 'Airbnb', url: 'https://www.airbnb.com', icon: 'logos:airbnb-icon'},
  {name: 'Gmail', url: 'https://www.gmail.com', icon: 'logos:google-gmail'}
]

function navigate() {
  let url = urlInput.value.trim()
  if (!url.startsWith('http')) {
    url = 'https://' + url
  }
  goToUrl(url)
}

function goToUrl(url: string) {
  currentUrl.value = url
  urlInput.value = url
  if (historyIndex.value < history.value.length - 1) {
    history.value = history.value.slice(0, historyIndex.value + 1)
  }
  history.value.push(url)
  historyIndex.value = history.value.length - 1
}

function goBack() {
  if (historyIndex.value > 0) {
    historyIndex.value--
    currentUrl.value = history.value[historyIndex.value]
    urlInput.value = currentUrl.value
  }
}

function goForward() {
  if (historyIndex.value < history.value.length - 1) {
    historyIndex.value++
    currentUrl.value = history.value[historyIndex.value]
    urlInput.value = currentUrl.value
  }
}

const isInstagram = computed(() => currentUrl.value.includes('instagram.com'))
const isAirbnb = computed(() => currentUrl.value.includes('airbnb.com'))
const isGmail = computed(() => currentUrl.value.includes('gmail.com'))


// Instagram State
const activeChat = ref(0)
const instagramChats = [
  {
    id: 0,
    user: 'Clément',
    avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Sarah',
    messages: [
      { text: 'Hey Salut Clara ! Tu vas bien ?', me: false, date: '14 avril' },
      { text: 'Salut Clément ! Ça va super et toi ?', me: true, date: '14 avril' },
      { text: 'Ça va ! Dis, j\'ai une place de ciné en trop pour ce week-end, ça te dirait ? ', me: false, date: '14 avril' },
      { text: 'Carrément ! On se dit quelle heure ?', me: true, date: '14 avril' },
      { text: 'Go pour 19h !', me: false, date: '14 avril' },
      { text: 'C’était top ce soir ! Ça te dit de se refaire une sortie demain ? Genre boire un verre en ville ?', me: false, date: '19 avril' },
      { text: 'Ah demain je peux pas, j\'ai déjà un truc de prévu ! Une prochaine !', me: true, date: '19 avril' },
      { text: 'Pas de souci ! Bonne soirée alors ❤️', me: false, date: '19 avril' },
      { text: 'Hey Clara ! Dispo pour se voir aujourd’hui ? Je suis pas loin de chez toi là', me: false, date: '26 avril' },
      { text: 'Salut Clem ! Désolée je suis pas mal occupée en ce moment, je sors pas trop.', me: true, date: '26 avril' },
      { text: 'Salut Clara, faut que je te demande un truc... J\'ai l\'impression que tu m\'évites depuis le ciné ?', me: false, date: '1 mai' },
      { text: 'C\'est pas que je t\'évite Clem, c\'est juste que je préfère qu\'on reste sur des sorties en groupe.', me: true, date: '1 mai' },
      { text: 'Pourquoi ? J\'ai fait un truc de travers ?', me: false, date: '1 mai' },
      { text: 'Mais non ! C’est juste que je sens que c’est un peu ambigu entre nous et je veux pas qu’il y ait de malentendu.', me: true, date: '1 mai' },
      { text: 'Clément, je t’adore, mais c’est purement amical de mon côté. Je veux pas te faire de faux espoirs.', me: true, date: '1 mai' },
      { text: 'Ah... d\'accord. Je pensais pas que c\'était si flagrant.', me: false, date: '1 mai' },
      { text: 'Je sais pas trop quoi dire là... Je vais digérer le truc.', me: false, date: '1 mai' },
      { text: 'Désolé !', me: true, date: '1 mai' },
      { text: 'Je n\'arrête pas de relire nos derniers messages... J\'arrive pas à croire que c\'est fini comme ça.', me: false, date: '25 août' },
      { text: 'Je m\'en veux d\'avoir été lourd avec toi, de ne pas avoir juste profité du moment sans rien attendre en retour.', me: false, date: '25 août' },
      { text: 'T\'étais la personne la plus vraie de ce groupe. Mimizan n\'aura plus aucun sens maintenant.', me: false, date: '25 août' },
      { text: 'Tu vas me manquer Clara. Vraiment. ❤️', me: false, date: '25 août' },
    ]
  },
  {
    id: 1,
    user: 'Daphné',
    avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Alex',
    messages: [
      { text: 'Clara, j\'ai besoin de te parler de quelque chose...', me: false, date: '12 avril' },
      { text: 'Oui ! Qu\'est-ce qu\'il y a ?', me: true, date: '12 avril' },
      { text: 'Hier j\'étais en soirée avec Mathieu... et on s\'est embrassé...', me: false, date: '12 avril' },
      { text: 'Mais Daphné, tu me fais une blague ?', me: true, date: '12 avril' },
      { text: 'Écoute, je te jure, j\'étais complètement bourré et je regrette vraiment ce que j\'ai fait...', me: false, date: '12 avril' },
      { text: 'Arthur est au courant de ça ?', me: true, date: '12 avril' },
      { text: 'Non, je sais pas comment abordé ça avec lui..', me: false, date: '12 avril' },
      { text: 'Tu dois lui en parler et au plus vite Daph !', me: true, date: '12 avril' },
      { text: 'Je lui en parlerai oui promis !', me: false, date: '12 avril' },
      { text: 'Je te fais confiance !', me: true, date: '12 avril' },
      { text: 'Clara, faut que je te dise un truc !', me: false, date: '26 avril' },
      { text: 'Dis moi ? T\'as enfin décider d\'en parler à Arthur ?', me: true, date: '26 avril' },
      { text: 'Ah non...' , me: false, date: '26 avril' },
      { text: 'Pour être tout à fait honnête, j\'ai revu mathieu et il m\'a invité chez lui.' , me: false, date: '26 avril' },
      { text: 'J\'ai passé la soirée là-bas et on a ...' , me: false, date: '26 avril' },
      { text: 'Tu te fou de moi ?? ' , me: true, date: '26 avril' },
      { text: 'T\'es pas sérieuse ? ' , me: true, date: '26 avril' },
      { text: 'Je plaisante pas Clara, mais s\'il te plaît comprends moi ! ' , me: false, date: '26 avril' },
      { text: 'Comprendre quoi ??? Que t\'as trompé ton mec ? ' , me: true, date: '26 avril' },
      { text: 'Et puis j\'imagine que Arthur ne sait toujours rien ?' , me: true, date: '26 avril' },
      { text: '...' , me: false, date: '26 avril' },
      { text: 'Tu me déçois énormément Daphné.' , me: true, date: '26 avril' },
      { text: 'Clara.. je sais que tu m\'en veux toujours, mais tu me manques trop. On peut pas rester comme ça pour une erreur que j\'ai faite.' , me: false, date: '10 mai' },
      { text: 'C\'est pas "une erreur", Daph, c\'est la situation entière qui est nase. Mais bon... tu me manques aussi, j\'avoue.' , me: true, date: '10 mai' },
      { text: 'Je te jure que je vais régler ça. On peut se voir ? Juste nous deux ?' , me: false, date: '10 mai' },
      { text: 'Ok. On se voit, mais on parle pas de Mathieu, j\'ai besoin de décompresser.' , me: true, date: '10 mai' },
      { text: 'Trop hâte de la soirée de demain ! Arthur m\'a demandé si tu venais avec Clément.' , me: false, date: '18 mai' },
      { text: 'Oui on sera là. Par contre, il m\'a posé des questions sur tes "retards" au boulot l\'autre jour... J\'ai dû inventer un truc pour te couvrir.' , me: true, date: '18 mai' },
      { text: 'Merci Clara, t\'es la meilleure, je te revaudrai ça ! ❤️' , me: false, date: '18 mai' },
      { text: 'Me remercie pas, je me sens super mal de lui mentir en plein visage. Fais en sorte que ça n\'arrive plus. ️' , me: true, date: '18 mai' },
      { text: 'Salut Daphné ! Avec Clément et Mathieu on voulait organiser une soirée pour se revoir tous ensemble' , me: true, date: '6 Août' },
      { text: 'Ce serait pour un airbnb à Mimizan le 16 au 23 août ? Vous seriez dispo ?' , me: true, date: '6 Août' },
      { text: 'Salut Clara !! Ouii avec plaisir !! Ça fait super longtemps qu\'on s\'est pas vu en plus !  ' , me: false, date: '6 Août' },
      { text: 'Super !! Je réserve ça alors ! Je pense que ce serait bien aussi que tu te décides d\'agir ! Mon quota de mensonges pour Arthur est épuisé. ' , me: true, date: '6 Août' },
      { text: 'Je sais Clara... j\'y pense tout le temps je te jure. Mais là c\'est pas le bon moment, il est tendu avec le boulot... Je lui dirai juste après le séjour, promis ! On en profite une dernière fois tous ensemble ? ' , me: false, date: '6 Août' },
      { text: 'Tu disais déjà ça les mois derniers Daphné... Bref, on en reparlera.' , me: true, date: '6 Août' },
      { text: 'Ce weekend soit tu lui dis, soit c\'est moi qui le fait..' , me: true, date: '16 Août' },

    ]
  }
]

// Airbnb State
const airbnbListing = {
  title: 'Villa Rose',
  price: '150€ / nuit',
  rating: '4.92 (124 commentaires)',
  images: [
    '/picture/airbnb/9A59DCF2-65DF-4490-860D-F6FADA407C1A.jpg',
    '/picture/airbnb/FB1A3CD5-7683-4099-B0B0-A81D89DD2193.jpg',
    '/picture/airbnb/E757D2DC-D509-4DEC-A142-51A1069C3C1F.jpg'
  ],
  description: 'Une villa spacieuse avec 3 chambres, un grand salon, une cuisine ouverte sur le salon. Idéal pour les soirées en famille.'
}
function shouldShowDate(messages: any[], index: number): boolean {
  if (index === 0) return true
  return messages[index].date !== messages[index - 1].date
}

//Gmail State
// Gmail State
const gmailOpen = ref(false)
const selectedMail = ref(0)
const replyOpen = ref(false)
const replySent = ref(false)
const replyText = ref('')
const notifVisible = ref(true)

const mails = [
  {
    id: 0, unread: true,
    from: 'Prof. Moriarty', email: 'prof.moriarty@univ.fr',
    subject: 'Rapport de laboratoire — URGENT',
    preview: 'Vous devez me remettre le rapport du labo avant vendredi...',
    date: '10:42',
    body: `Bonjour,<br><br>Je vous rappelle que vous devez me remettre le rapport de laboratoire <strong>avant vendredi 12 avril</strong> à 18h00.<br><br>Merci de le déposer sur la plateforme Moodle dans la section "Rendus TP".<br><br>Sans retour de votre part, une pénalité sera appliquée.<br><br>Cordialement,<br><strong>Professeur Moriarty</strong><br><span style="color:#888;font-size:12px">Département de Sciences — Bureau 214</span>`
  },
  {
    id: 1, unread: true,
    from: 'Mme. Leblanc', email: 'm.leblanc@univ.fr',
    subject: 'Invitation — Réunion projet Cluedo',
    preview: 'Bonjour, je vous invite à la réunion de présentation du projet...',
    date: 'Hier',
    body: `Bonjour,<br><br>Je vous invite à la réunion de présentation du projet Cluedo qui aura lieu <strong>jeudi 10 avril à 14h</strong> en salle B203.<br><br>Merci de confirmer votre présence par retour de mail.<br><br>Cordialement,<br><strong>Mme. Leblanc</strong>`
  },
  {
    id: 2, unread: true,
    from: 'Secrétariat', email: 'secretariat@univ.fr',
    subject: 'Rappel — Inscription examens',
    preview: 'N\'oubliez pas de vous inscrire aux examens du second semestre...',
    date: 'Lun.',
    body: `Bonjour,<br><br>N'oubliez pas de vous inscrire aux examens du second semestre avant le <strong>15 avril 2026</strong>.<br><br>La procédure d'inscription est disponible sur le portail étudiant.<br><br>Le Secrétariat`
  }
]

const unreadCount = computed(() => mails.filter(m => m.unread).length)

function selectMail(id: number) {
  selectedMail.value = id
  mails[id].unread = false
  replyOpen.value = false
  replySent.value = false
  replyText.value = ''
}

function sendReply() {
  if (!replyText.value.trim()) return
  replySent.value = true
  replyOpen.value = false
}

</script>

<template>
  <div class="edge-app">
    <!-- Browser Header -->
    <div class="browser-header">
      <div class="nav-controls">
        <button :disabled="historyIndex === 0" class="nav-btn" @click="goBack">
          <Icon name="fluent:chevron-left-24-regular"/>
        </button>
        <button :disabled="historyIndex === history.length - 1" class="nav-btn" @click="goForward">
          <Icon name="fluent:chevron-right-24-regular"/>
        </button>
        <button class="nav-btn" @click="goToUrl(currentUrl)">
          <Icon name="fluent:arrow-clockwise-24-regular"/>
        </button>
        <button class="nav-btn" @click="goToUrl('https://www.bing.com')">
          <Icon name="fluent:home-24-regular"/>
        </button>
      </div>

      <div class="address-bar">
        <Icon class="lock-icon" name="fluent:lock-closed-16-regular"/>
        <input
            v-model="urlInput"
            placeholder="Rechercher ou entrer une URL"
            @keyup.enter="navigate"
        />
        <Icon class="star-icon" name="fluent:star-24-regular"/>
      </div>

      <div class="user-controls">
        <Icon name="fluent:person-24-regular"/>
        <Icon name="fluent:more-horizontal-24-regular"/>
      </div>
    </div>

    <!-- Favorites Bar -->
    <div class="favorites-bar">
      <button
          v-for="fav in favorites"
          :key="fav.url"
          class="fav-item"
          @click="goToUrl(fav.url)"
      >
        <Icon :name="fav.icon" class="fav-icon"/>
        <span>{{ fav.name }}</span>
      </button>
    </div>

    <!-- Browser Content -->
    <div class="browser-viewport">
      <!-- FAKE INSTAGRAM -->
      <div v-if="isInstagram" class="instagram-ui">
        <aside class="insta-sidebar">
          <div class="insta-logo">Instagram</div>
          <nav>
            <div class="nav-item">
              <Icon name="fluent:home-24-filled"/>
              <span>Accueil</span></div>
            <div class="nav-item">
              <Icon name="fluent:search-24-regular"/>
              <span>Recherche</span></div>
            <div class="nav-item active">
              <Icon name="fluent:chat-24-regular"/>
              <span>Messages</span></div>
            <div class="nav-item">
              <Icon name="fluent:heart-24-regular"/>
              <span>Notifications</span></div>
            <div class="nav-item">
              <Icon name="fluent:add-square-24-regular"/>
              <span>Créer</span></div>
          </nav>
        </aside>

        <main class="insta-messages">
          <div class="chat-list">
            <div class="chat-list-header">
              <span>Direct</span>
              <Icon name="fluent:compose-24-regular"/>
            </div>
            <div
                v-for="chat in instagramChats"
                :key="chat.id"
                :class="{ active: activeChat === chat.id }"
                class="chat-item"
                @click="activeChat = chat.id"
            >
              <img :src="chat.avatar" class="avatar"/>
              <div class="chat-info">
                <div class="username">{{ chat.user }}</div>
                <div class="last-msg">{{ chat.messages[chat.messages.length - 1].text }}</div>
              </div>
            </div>
          </div>
          <div class="chat-view">
            <div class="chat-header">
              <img :src="instagramChats[activeChat].avatar" class="avatar"/>
              <span class="username">{{ instagramChats[activeChat].user }}</span>
              <div class="chat-actions">
                <Icon name="fluent:phone-24-regular"/>
                <Icon name="fluent:video-24-regular"/>
                <Icon name="fluent:info-24-regular"/>
              </div>
            </div>
            <div class="messages-area">
              <template v-for="(msg, i) in instagramChats[activeChat].messages" :key="i">
                <!-- Séparateur de date -->
                <div v-if="shouldShowDate(instagramChats[activeChat].messages, i)" class="date-separator">
                  <span>{{ msg.date }}</span>
                </div>
                <!-- Message -->
                <div :class="{ me: msg.me }" class="msg-bubble">
                  {{ msg.text }}
                </div>
              </template>
            </div>
            <div class="msg-input">
              <Icon name="fluent:emoji-24-regular"/>
              <input placeholder="Écrire un message..."/>
              <Icon name="fluent:image-24-regular"/>
              <Icon name="fluent:heart-24-regular"/>
            </div>
          </div>
        </main>
      </div>

      <!-- FAKE AIRBNB -->
      <div v-else-if="isAirbnb" class="airbnb-ui">
        <header class="airbnb-header">
          <div class="logo">
            <Icon name="logos:airbnb-icon"/>
            <span>airbnb</span>
          </div>
          <div class="search-bar-mock">
            <span>N'importe où</span> | <span>Une semaine</span> | <span>Ajouter des voyageurs</span>
            <div class="search-icon">
              <Icon name="fluent:search-16-filled"/>
            </div>
          </div>
          <div class="user-menu">
            <span>Mettre mon logement sur Airbnb</span>
            <Icon name="fluent:globe-24-regular"/>
            <div class="profile-btn">
              <Icon name="fluent:line-horizontal-3-24-regular"/>
              <Icon name="fluent:person-circle-24-regular"/>
            </div>
          </div>
        </header>

        <main class="airbnb-content">
          <div class="listing-title">
            <h1>{{ airbnbListing.title }}</h1>
            <div class="listing-meta">
              <span><Icon name="fluent:star-16-filled"/> {{ airbnbListing.rating }}</span>
              <u>Villa, Mimizan</u>
            </div>
          </div>

          <div class="listing-gallery">
            <div :style="{ backgroundImage: `url(${airbnbListing.images[0]})` }" class="main-img"></div>
            <div class="side-imgs">
              <div :style="{ backgroundImage: `url(${airbnbListing.images[1]})` }" class="side-img"></div>
              <div :style="{ backgroundImage: `url(${airbnbListing.images[2]})` }" class="side-img"></div>
              <div class="side-img more">Afficher toutes les photos</div>
            </div>
          </div>

          <div class="listing-details">
            <div class="info">
              <h2>Logement entier : Villa Rose</h2>
              <p>6 voyageurs · 3 chambres · 3 lits · 1 salle de bain</p>
              <hr/>
              <div class="desc">{{ airbnbListing.description }}</div>
            </div>
            <div class="booking-card">
              <div class="card-header">
                <span class="price"><b>{{ airbnbListing.price }}</b> / nuit</span>
                <span class="rating"><Icon name="fluent:star-16-filled"/> 4.92</span>
              </div>
              <div class="booking-inputs">
                <div class="date-inputs">
                  <div class="input">ARRIVÉE<br/>16/07/2025</div>
                  <div class="input">DÉPART<br/>23/07/2025</div>
                </div>
                <div class="guest-input">VOYAGEURS<br/>1 voyageur</div>
              </div>
              <button class="reserve-btn">Réserver</button>
              <p class="no-charge">Aucun débit pour le moment</p>
            </div>
          </div>
        </main>
      </div>
      <!-- FAKE GMAIL -->
      <div v-else-if="isGmail" class="gmail-ui">

        <!-- Notification pop-up -->
        <div v-if="notifVisible" class="gmail-notif" @click="notifVisible = false">
          <div class="notif-icon">✉</div>
          <div class="notif-content">
            <div class="notif-app">Courrier</div>
            <div class="notif-title">Prof. Moriarty</div>
            <div class="notif-body">Vous devez me remettre le rapport du labo...</div>
          </div>
          <button class="notif-close" @click.stop="notifVisible = false">✕</button>
        </div>

        <!-- Sidebar -->
        <div class="gmail-sidebar">
          <div class="gmail-sidebar-label">Dossiers</div>
          <div class="gmail-sidebar-item active">
            📥 Boîte de réception
            <span v-if="unreadCount > 0" class="gmail-badge">{{ unreadCount }}</span>
          </div>
          <div class="gmail-sidebar-item">📤 Envoyés</div>
          <div class="gmail-sidebar-item">📝 Brouillons</div>
          <div class="gmail-sidebar-item">🗑 Corbeille</div>
        </div>

        <!-- Liste des mails -->
        <div class="gmail-list">
          <div class="gmail-list-header">{{ unreadCount }} messages non lus</div>
          <div
              v-for="mail in mails" :key="mail.id"
              :class="{ unread: mail.unread, selected: selectedMail === mail.id }"
              class="gmail-item"
              @click="selectMail(mail.id)"
          >
            <div class="gmail-item-sender">
              {{ mail.from }}
              <div class="gmail-item-right">
                <span class="gmail-time">{{ mail.date }}</span>
                <span v-if="mail.unread" class="unread-dot"></span>
              </div>
            </div>
            <div class="gmail-item-subject">{{ mail.subject }}</div>
            <div class="gmail-item-preview">{{ mail.preview }}</div>
          </div>
        </div>

        <!-- Lecteur de mail -->
        <div class="gmail-reader">
          <div class="gmail-reader-header">
            <div class="gmail-reader-subject">{{ mails[selectedMail].subject }}</div>
            <div class="gmail-reader-meta">
              <span>De : <strong>{{ mails[selectedMail].email }}</strong></span>
              <span>À : clara.moreau@univ.fr</span>
            </div>
          </div>
          <div class="gmail-reader-actions">
            <button class="action-btn primary-action" @click="replyOpen = !replyOpen">↩ Répondre</button>
            <button class="action-btn">↪ Transférer</button>
            <button class="action-btn">🗑 Supprimer</button>
          </div>
          <div class="gmail-reader-body" v-html="mails[selectedMail].body"></div>

          <!-- Zone de réponse -->
          <div v-if="replyOpen" class="gmail-reply">
            <div class="gmail-reply-to">À : {{ mails[selectedMail].email }}</div>
            <textarea v-model="replyText" placeholder="Écrivez votre réponse..."></textarea>
            <div class="gmail-reply-actions">
              <button class="reply-btn secondary" @click="replyOpen = false">Annuler</button>
              <button class="reply-btn primary" @click="sendReply">Envoyer ✓</button>
            </div>
          </div>
          <div v-if="replySent" class="reply-sent">✓ Email envoyé avec succès !</div>
        </div>

      </div>

      <!-- DEFAULT BING / HOME -->
      <div v-else class="bing-ui">
        <div class="bing-search">
          <div class="bing-logo-container">
            <Icon name="logos:bing" style="font-size: 80px;"/>
            <span class="bing-text">Bing</span>
          </div>
          <div class="search-input-container">
            <input v-model="urlInput" placeholder="Rechercher sur le Web" @keyup.enter="navigate"/>
            <Icon class="search-icon" name="fluent:search-24-filled"/>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<style lang="scss" scoped>

/* GMAIL UI */
.gmail-ui {
  display: flex;
  height: 100%;
  background: #f3f3f3;
  position: relative;

  .gmail-notif {
    position: absolute;
    bottom: 16px;
    right: 16px;
    background: rgba(20, 20, 40, 0.92);
    border: 0.5px solid rgba(255,255,255,0.2);
    border-radius: 8px;
    padding: 12px 16px;
    color: white;
    width: 280px;
    cursor: pointer;
    display: flex;
    gap: 12px;
    align-items: flex-start;
    z-index: 100;
    animation: slideIn 0.3s ease;

    @keyframes slideIn {
      from { transform: translateX(120%); opacity: 0; }
      to { transform: translateX(0); opacity: 1; }
    }

    .notif-icon {
      width: 32px; height: 32px;
      background: #0078d4;
      border-radius: 6px;
      display: flex; align-items: center; justify-content: center;
      flex-shrink: 0;
    }
    .notif-content { flex: 1; }
    .notif-app { font-size: 11px; color: rgba(255,255,255,0.5); margin-bottom: 2px; }
    .notif-title { font-size: 13px; font-weight: 600; margin-bottom: 2px; }
    .notif-body { font-size: 12px; color: rgba(255,255,255,0.7); }
    .notif-close {
      background: none; border: none; color: rgba(255,255,255,0.4);
      cursor: pointer; font-size: 14px;
      &:hover { color: white; }
    }
  }

  .gmail-sidebar {
    width: 200px;
    background: #faf9f8;
    border-right: 0.5px solid #e0e0e0;
    padding-top: 8px;

    .gmail-sidebar-label {
      padding: 8px 16px 4px;
      font-size: 11px;
      color: #888;
      text-transform: uppercase;
      letter-spacing: 0.5px;
    }

    .gmail-sidebar-item {
      padding: 8px 16px;
      font-size: 13px;
      color: #333;
      cursor: pointer;
      display: flex;
      align-items: center;
      gap: 8px;
      border-left: 3px solid transparent;

      &:hover { background: #e8e8e8; }
      &.active { background: #deecf9; border-left-color: #0078d4; color: #0078d4; font-weight: 500; }
    }

    .gmail-badge {
      margin-left: auto;
      background: #0078d4;
      color: white;
      font-size: 10px;
      font-weight: 600;
      padding: 2px 6px;
      border-radius: 10px;
    }
  }

  .gmail-list {
    width: 260px;
    background: white;
    border-right: 0.5px solid #e0e0e0;
    display: flex;
    flex-direction: column;
    overflow-y: auto;

    .gmail-list-header {
      padding: 10px 14px;
      background: #f8f8f8;
      border-bottom: 0.5px solid #e0e0e0;
      font-size: 12px;
      color: #666;
    }

    .gmail-item {
      padding: 12px 14px;
      border-bottom: 0.5px solid #f0f0f0;
      cursor: pointer;

      &:hover { background: #f5f5f5; }
      &.selected { background: #deecf9; }
      &.unread .gmail-item-sender { font-weight: 700; }

      .gmail-item-sender {
        font-size: 13px;
        color: #1a1a1a;
        margin-bottom: 2px;
        display: flex;
        justify-content: space-between;
        align-items: center;

        .gmail-item-right {
          display: flex;
          gap: 6px;
          align-items: center;
        }
      }

      .gmail-time { font-size: 11px; color: #999; }

      .unread-dot {
        width: 8px; height: 8px;
        background: #0078d4;
        border-radius: 50%;
      }

      .gmail-item-subject {
        font-size: 12px;
        color: #333;
        white-space: nowrap;
        overflow: hidden;
        text-overflow: ellipsis;
        margin-bottom: 2px;
      }

      .gmail-item-preview {
        font-size: 11px;
        color: #888;
        white-space: nowrap;
        overflow: hidden;
        text-overflow: ellipsis;
      }
    }
  }

  .gmail-reader {
    flex: 1;
    display: flex;
    flex-direction: column;
    background: white;
    overflow: hidden;

    .gmail-reader-header {
      padding: 16px 20px 12px;
      border-bottom: 0.5px solid #e0e0e0;
    }

    .gmail-reader-subject {
      font-size: 18px;
      font-weight: 600;
      color: #1a1a1a;
      margin-bottom: 8px;
    }

    .gmail-reader-meta {
      font-size: 12px;
      color: #666;
      display: flex;
      gap: 12px;
    }

    .gmail-reader-actions {
      display: flex;
      gap: 8px;
      padding: 10px 20px;
      border-bottom: 0.5px solid #f0f0f0;

      .action-btn {
        padding: 5px 12px;
        border: 0.5px solid #c8c8c8;
        border-radius: 4px;
        background: white;
        color: #333;
        font-size: 12px;
        cursor: pointer;
        &:hover { background: #f0f0f0; }
        &.primary-action { background: #0078d4; color: white; border-color: #0078d4; &:hover { background: #106ebe; } }
      }
    }

    .gmail-reader-body {
      flex: 1;
      padding: 20px;
      font-size: 14px;
      color: #333;
      line-height: 1.7;
      overflow-y: auto;
    }

    .gmail-reply {
      padding: 12px 20px;
      border-top: 0.5px solid #e0e0e0;

      .gmail-reply-to {
        font-size: 12px;
        color: #666;
        margin-bottom: 8px;
      }

      textarea {
        width: 100%;
        height: 80px;
        padding: 8px 12px;
        border: 0.5px solid #c8c8c8;
        border-radius: 4px;
        font-size: 13px;
        resize: none;
        outline: none;
        &:focus { border-color: #0078d4; box-shadow: 0 0 0 2px rgba(0,120,212,0.15); }
      }

      .gmail-reply-actions {
        display: flex;
        gap: 8px;
        margin-top: 8px;
        justify-content: flex-end;

        .reply-btn {
          padding: 6px 14px;
          border-radius: 4px;
          font-size: 13px;
          cursor: pointer;
          border: none;
          &.primary { background: #0078d4; color: white; &:hover { background: #106ebe; } }
          &.secondary { background: white; color: #333; border: 0.5px solid #c8c8c8; &:hover { background: #f0f0f0; } }
        }
      }
    }

    .reply-sent {
      margin: 8px 20px;
      padding: 8px 12px;
      background: #dff6dd;
      border: 0.5px solid #a3d977;
      border-radius: 4px;
      color: #2a6e1e;
      font-size: 13px;
    }
  }
}

.edge-app {
  display: flex;
  flex-direction: column;
  height: 100%;
  background: #fff;
  color: #333;
  font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif;
}

.browser-header {
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 8px 12px;
  background: #f3f3f3;
  border-bottom: 1px solid #d0d0d0;

  .nav-controls {
    display: flex;
    gap: 4px;

    .nav-btn {
      background: transparent;
      border: none;
      width: 28px;
      height: 28px;
      display: flex;
      align-items: center;
      justify-content: center;
      border-radius: 4px;
      cursor: pointer;

      &:hover:not(:disabled) {
        background: #e0e0e0;
      }

      &:disabled {
        opacity: 0.3;
        cursor: default;
      }

      font-size: 18px;
    }
  }

  .address-bar {
    flex: 1;
    display: flex;
    align-items: center;
    gap: 8px;
    padding: 4px 12px;
    background: white;
    border: 1px solid #c0c0c0;
    border-radius: 16px;
    font-size: 13px;

    &:focus-within {
      border-color: #0078d4;
      box-shadow: 0 0 0 1px #0078d4;
    }

    input {
      flex: 1;
      border: none;
      outline: none;
      font-size: 13px;
    }

    .lock-icon {
      color: #555;
    }

    .star-icon {
      color: #555;
      cursor: pointer;

      &:hover {
        color: #0078d4;
      }
    }
  }

  .user-controls {
    display: flex;
    gap: 12px;
    font-size: 18px;
    color: #555;
    cursor: pointer;
  }
}

.favorites-bar {
  display: flex;
  gap: 16px;
  padding: 4px 16px;
  background: #f3f3f3;
  border-bottom: 1px solid #d0d0d0;
  font-size: 12px;

  .fav-item {
    display: flex;
    align-items: center;
    gap: 6px;
    padding: 4px 8px;
    background: transparent;
    border: none;
    cursor: pointer;
    border-radius: 4px;

    &:hover {
      background: #e0e0e0;
    }

    .fav-icon {
      font-size: 16px;
    }
  }
}

.browser-viewport {
  flex: 1;
  overflow: auto;
  position: relative;
}

/* INSTAGRAM UI */
.instagram-ui {
  display: flex;
  height: 100%;
  background: #fff;

  .insta-sidebar {
    width: 220px;
    border-right: 1px solid #dbdbdb;
    padding: 20px 12px;
    display: flex;
    flex-direction: column;

    .insta-logo {
      font-family: 'Billabong', cursive;
      font-size: 28px;
      margin-bottom: 30px;
      padding-left: 12px;
      font-weight: bold;
    }

    nav {
      .nav-item {
        display: flex;
        align-items: center;
        gap: 16px;
        padding: 12px;
        border-radius: 8px;
        cursor: pointer;
        transition: background 0.2s;
        font-size: 16px;

        &:hover {
          background: #f2f2f2;
        }

        &.active {
          font-weight: bold;
        }

        span {
          font-size: 15px;
        }
      }
    }
  }

  .insta-messages {
    flex: 1;
    display: flex;

    .chat-list {
      width: 350px;
      border-right: 1px solid #dbdbdb;
      display: flex;
      flex-direction: column;

      .chat-list-header {
        padding: 20px;
        display: flex;
        justify-content: space-between;
        align-items: center;
        font-weight: bold;
        font-size: 20px;
      }

      .chat-item {
        display: flex;
        align-items: center;
        gap: 12px;
        padding: 8px 20px;
        cursor: pointer;

        &:hover {
          background: #f2f2f2;
        }

        &.active {
          background: #efefef;
        }

        .avatar {
          width: 56px;
          height: 56px;
          border-radius: 50%;
        }

        .chat-info {
          .username {
            font-weight: 600;
            font-size: 14px;
          }

          .last-msg {
            font-size: 12px;
            color: #737373;
            white-space: nowrap;
            overflow: hidden;
            text-overflow: ellipsis;
            max-width: 220px;
          }
        }
      }
    }

    .chat-view {
      flex: 1;
      display: flex;
      flex-direction: column;

      .chat-header {
        padding: 12px 20px;
        border-bottom: 1px solid #dbdbdb;
        display: flex;
        align-items: center;
        gap: 12px;

        .avatar {
          width: 44px;
          height: 44px;
          border-radius: 50%;
        }

        .username {
          font-weight: 600;
        }

        .chat-actions {
          margin-left: auto;
          display: flex;
          gap: 16px;
          font-size: 24px;
        }
      }

      .messages-area {
        flex: 1;
        padding: 20px;
        display: flex;
        flex-direction: column;
        gap: 8px;
        overflow-y: auto;

        .date-separator {        // ← ajoute ce bloc
          display: flex;
          align-items: center;
          gap: 12px;
          align-self: stretch;   // ← prend toute la largeur
          margin: 8px 0;

          &::before, &::after {
            content: '';
            flex: 1;
            height: 1px;
            background: #dbdbdb;
          }

          span {
            font-size: 12px;
            color: #737373;      // ← gris, change en #ffffff pour blanc
            white-space: nowrap;
          }
        }

        .msg-bubble {
          // ... ton code existant, inchangé
        }

        .msg-bubble {
          max-width: 60%;
          padding: 8px 16px;
          border-radius: 22px;
          font-size: 14px;
          line-height: 1.4;

          &:not(.me) {
            background: #fff;
            border: 1px solid #efefef;
            align-self: flex-start;
          }

          &.me {
            background: #3797f0;
            color: white;
            align-self: flex-end;
          }
        }
      }

      .msg-input {
        margin: 20px;
        padding: 10px 16px;
        border: 1px solid #dbdbdb;
        border-radius: 22px;
        display: flex;
        align-items: center;
        gap: 12px;

        input {
          flex: 1;
          border: none;
          outline: none;
          font-size: 14px;
        }

        font-size: 24px;
      }
    }
  }
}

/* AIRBNB UI */
.airbnb-ui {
  background: white;
  min-height: 100%;

  .airbnb-header {
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding: 16px 80px;
    border-bottom: 1px solid #ebebeb;

    .logo {
      display: flex;
      align-items: center;
      gap: 4px;
      color: #ff385c;
      font-size: 24px;
      font-weight: bold;

      span {
        font-size: 22px;
        margin-bottom: 4px;
      }
    }

    .search-bar-mock {
      display: flex;
      align-items: center;
      gap: 12px;
      padding: 8px 8px 8px 24px;
      border: 1px solid #ddd;
      border-radius: 40px;
      box-shadow: 0 1px 2px rgba(0, 0, 0, 0.08);
      font-size: 14px;
      font-weight: 600;
      cursor: pointer;

      &:hover {
        box-shadow: 0 4px 6px rgba(0, 0, 0, 0.12);
      }

      span {
        padding: 0 8px;
      }

      .search-icon {
        background: #ff385c;
        color: white;
        width: 32px;
        height: 32px;
        border-radius: 50%;
        display: flex;
        align-items: center;
        justify-content: center;
      }
    }

    .user-menu {
      display: flex;
      align-items: center;
      gap: 16px;
      font-size: 14px;
      font-weight: 600;

      .profile-btn {
        display: flex;
        align-items: center;
        gap: 12px;
        padding: 5px 5px 5px 12px;
        border: 1px solid #ddd;
        border-radius: 21px;
        cursor: pointer;
        font-size: 20px;
        color: #717171;

        &:hover {
          box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
        }
      }
    }
  }

  .airbnb-content {
    max-width: 1120px;
    margin: 0 auto;
    padding: 24px 80px;

    .listing-title {
      h1 {
        font-size: 26px;
        margin-bottom: 4px;
      }

      .listing-meta {
        font-size: 14px;
        font-weight: 600;
        display: flex;
        gap: 12px;
        align-items: center;

        span {
          display: flex;
          align-items: center;
          gap: 4px;
        }
      }
    }

    .listing-gallery {
      margin-top: 24px;
      display: grid;
      grid-template-columns: 2fr 1fr;
      gap: 8px;
      height: 400px;
      border-radius: 12px;
      overflow: hidden;

      .main-img {
        background-size: cover;
        background-position: center;
        border-radius: 12px;
      }

      .side-imgs {
        display: flex;
        flex-direction: column;
        gap: 8px;

        .side-img {
          flex: 1;
          background-size: cover;
          background-position: center;
          border-radius: 12px;

          &.more {
            display: flex;
            align-items: flex-end;
            padding: 12px;
            background-color: #f7f7f7;
            font-size: 14px;
            font-weight: 600;
            background-image: url('/picture/airbnb/B67B4336-8F16-4E10-9F34-E6452743C5F8.jpg');
            background-size: cover;
            background-position: center;
            color: white;
            cursor: pointer;
            border-radius: 12px;
            overflow: hidden;
            position: relative;

          }
        }
      }
    }

    .listing-details {
      display: grid;
      grid-template-columns: 1.5fr 1fr;
      gap: 80px;
      margin-top: 48px;

      .info {
        h2 {
          font-size: 22px;
          margin-bottom: 8px;
        }

        p {
          color: #222;
          margin-bottom: 24px;
        }

        .desc {
          font-size: 16px;
          line-height: 1.5;
          color: #222;
        }
      }

      .booking-card {
        border: 1px solid #ddd;
        border-radius: 12px;
        padding: 24px;
        box-shadow: 0 6px 16px rgba(0, 0, 0, 0.12);
        height: fit-content;
        position: sticky;
        top: 24px;

        .card-header {
          display: flex;
          justify-content: space-between;
          align-items: baseline;
          margin-bottom: 24px;

          .price {
            font-size: 22px;
          }

          .rating {
            font-size: 14px;
            font-weight: 600;
          }
        }

        .booking-inputs {
          border: 1px solid #b0b0b0;
          border-radius: 8px;
          margin-bottom: 16px;

          .date-inputs {
            display: grid;
            grid-template-columns: 1fr 1fr;

            .input {
              padding: 10px 12px;
              font-size: 10px;
              font-weight: 800;

              &:first-child {
                border-right: 1px solid #b0b0b0;
              }
            }
          }

          .guest-input {
            padding: 10px 12px;
            font-size: 10px;
            font-weight: 800;
            border-top: 1px solid #b0b0b0;
          }
        }

        .reserve-btn {
          width: 100%;
          padding: 14px;
          background: linear-gradient(to right, #e61e4d 0%, #e31c5f 50%, #d70466 100%);
          color: white;
          border: none;
          border-radius: 8px;
          font-size: 16px;
          font-weight: 600;
          cursor: pointer;
          margin-bottom: 8px;
        }

        .no-charge {
          text-align: center;
          font-size: 14px;
          color: #717171;
        }
      }
    }
  }
}

/* BING UI */
.bing-ui {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  height: 100%;
  background: linear-gradient(180deg, #eef5ff 0%, #fff 40%);

  .bing-search {
    width: 100%;
    max-width: 600px;
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 32px;

    .bing-logo-container {
      display: flex;
      align-items: center;
      gap: 12px;

      .bing-text {
        font-size: 64px;
        font-weight: 600;
        color: #0078d4;
      }
    }

    .search-input-container {
      width: 100%;
      display: flex;
      align-items: center;
      padding: 12px 20px;
      background: white;
      border-radius: 28px;
      box-shadow: 0 2px 12px rgba(0, 0, 0, 0.1);
      border: 1px solid #dfe1e5;

      input {
        flex: 1;
        border: none;
        outline: none;
        font-size: 16px;
      }

      .search-icon {
        color: #0078d4;
        cursor: pointer;
      }
    }
  }
}
</style>
