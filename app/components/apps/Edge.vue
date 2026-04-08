<script lang="ts" setup>
import {computed, ref} from 'vue'

const currentUrl = ref('https://www.bing.com')
const history = ref(['https://www.bing.com'])
const historyIndex = ref(0)
const urlInput = ref('https://www.bing.com')

const favorites = [
  {name: 'Instagram', url: 'https://www.instagram.com', icon: 'skill-icons:instagram'},
  {name: 'Airbnb', url: 'https://www.airbnb.com', icon: 'logos:airbnb-icon'}
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

// Instagram State
const activeChat = ref(0)
const instagramChats = [
  {
    id: 0,
    user: 'Alex Rivers',
    avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Alex',
    messages: [
      {text: 'Hey, t\'as vu l\'indice dans la cuisine ?', me: false},
      {text: 'Non, c\'était quoi ?', me: true},
      {text: 'Un chandelier plein de sang... flippant.', me: false}
    ]
  },
  {
    id: 1,
    user: 'Sarah Miller',
    avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Sarah',
    messages: [
      {text: 'On se voit ce soir pour la partie ?', me: false},
      {text: 'Oui ! J\'apporte le jeu.', me: true}
    ]
  }
]

// Airbnb State
const airbnbListing = {
  title: 'Manoir Mystérieux - Suite Tudor',
  price: '150€ / nuit',
  rating: '4.92 (124 commentaires)',
  images: [
    'https://images.unsplash.com/photo-1518780664697-55e3ad937233?auto=format&fit=crop&w=800&q=80',
    'https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?auto=format&fit=crop&w=800&q=80'
  ],
  description: 'Un manoir spacieux avec 6 chambres, un grand salon et une serre. Parfait pour les jeux de rôle grandeur nature. Attention aux bruits dans les murs la nuit.'
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
              <div
                  v-for="(msg, i) in instagramChats[activeChat].messages"
                  :key="i"
                  :class="{ me: msg.me }"
                  class="msg-bubble"
              >
                {{ msg.text }}
              </div>
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
              <u>Manoir, Royaume-Uni</u>
            </div>
          </div>

          <div class="listing-gallery">
            <div :style="{ backgroundImage: `url(${airbnbListing.images[0]})` }" class="main-img"></div>
            <div class="side-imgs">
              <div :style="{ backgroundImage: `url(${airbnbListing.images[1]})` }" class="side-img"></div>
              <div class="side-img more">Afficher toutes les photos</div>
            </div>
          </div>

          <div class="listing-details">
            <div class="info">
              <h2>Logement entier : manoir. Hôte : Colonel Moutarde</h2>
              <p>12 voyageurs · 6 chambres · 12 lits · 4 salles de bain</p>
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
                  <div class="input">ARRIVÉE<br/>01/05/2026</div>
                  <div class="input">DÉPART<br/>03/05/2026</div>
                </div>
                <div class="guest-input">VOYAGEURS<br/>1 voyageur</div>
              </div>
              <button class="reserve-btn">Réserver</button>
              <p class="no-charge">Aucun débit pour le moment</p>
            </div>
          </div>
        </main>
      </div>

      <!-- DEFAULT BING / HOME -->
      <div v-else class="bing-ui">
        <div class="bing-search">
          <img alt="Bing" height="80" src="https://www.bing.com/sa/simg/bing_logo_pr.png"/>
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
      }

      .side-imgs {
        display: flex;
        flex-direction: column;
        gap: 8px;

        .side-img {
          flex: 1;
          background-size: cover;
          background-position: center;

          &.more {
            display: flex;
            align-items: flex-end;
            padding: 12px;
            background-color: #f7f7f7;
            font-size: 14px;
            font-weight: 600;
            border: 1px solid #222;
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