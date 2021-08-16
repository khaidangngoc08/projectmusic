const $ = document.querySelector.bind(document);
const $$ = document.querySelectorAll.bind(document);

const heading = $('header h2');
const cdThumb = $('.cd-thumb');
const audio = $('#audio');
const cd = $('.cd');
const btnPlay = $('.btn-toggle-play');
const player = $('.player');
const playlist = $('.playlist');
const progress = $('#progress');
const nextBtn = $('.btn-next');
const prevBtn = $('btn-prev');
const randomBtn = $('btn-random');
const repeatBtn = $('.btn-repeat')

const app = {
    currentIndex: 0,
    isPlaying: false,
    isRandom: false,
    songs: [{
            name: 'Nevada',
            singer: 'Vicetone',
            path: 'do_toc.mp3',
            image: 'https://i.pinimg.com/originals/f8/6f/33/f86f3378e656883b33594f06d78d1634.jpg',
        },
        {
            name: 'DocToc2',
            singer: 'PhucDu',
            path: './music/do_toc.mp3',
            image: './img/doctoc2.jpg'
        },
        {
            name: 'SaoCungDuoc',
            singer: 'Binz',
            path: './music/sao_cung_duoc.mp3',
            image: './img/saocungdc.jpg'
        },
        {
            name: 'NoiAnhVe',
            singer: 'Binz',
            path: './music/noi_anh_ve.mp3',
            image: './img/noianhve.jpg'
        },
        {
            name: 'ThoiAnhKhongChoiDau',
            singer: 'Binz',
            path: './music/thoi_anh_khong_choi_dau.mp3',
            image: './img/takcd.jpg'
        }
    ],
    // render ra danh sach playlist
    render: function() {
        const htmls = this.songs.map((song, index) => {
            return `
                <div class="song ${index === this.currentIndex ? 'active': ''}">
                    <div
                        class="thumb"
                        style="background-image: url('${song.image}');">
                    </div>
                    <div class="body">
                        <h3 class="title">${song.name}</h3>
                        <p class="author">${song.singer}</p>
                    </div>
                    <div class="option">
                        <i class="fas fa-ellipsis-h"></i>
                    </div>
                </div>
            `
        })
        playlist.innerHTML = htmls.join('');
    },

    defineProperties: function() {
        Object.defineProperty(this, 'currentSong', {
            get: function() {
                return this.songs[this.currentIndex]
            },
        });
    },

    // lang nghe su kien
    handleEvents: function() {
        const _this = this
        const cdWidth = cd.offsetWidth

        // xu ly cd quay / dung
        const cdThumbAnimate = cdThumb.animate([
            { transform: 'rotate(160deg)' }
        ], {
            duration: 10000, // 10second
            interations: Infinity
        })
        cdThumbAnimate.pause()


        // xu ly phong to hoac thu nho cd 
        document.onscroll = function() {
            const scrollTop = window.scrollY || document.documentElement.scrollTop;
            const newCdWidth = cdWidth - scrollTop;

            cd.style.width = newCdWidth > 0 ? newCdWidth + 'px' : 0
            cd.style.opacity = newCdWidth / cdWidth;
        }

        //xu ly khi click play
        btnPlay.onclick = function() {
            if (_this.isPlaying) {
                audio.pause()
            } else {
                audio.play()
            }
        }

        // khi song duoc play 
        audio.onplay = function() {
            _this.isPlaying = true;
            player.classList.add('playing');
            cdThumbAnimate.play()
        }

        //khi song bi pause

        audio.pause = function() {
            _this.isPlaying = false;
            player.classList.remove('playing');
            cdThumbAnimate.pause()
        }

        //khi tien do bai hat thay doi
        audio.ontimeupdate = function() {
            if (audio.duration) {
                const progressPercent = Math.floor(audio.currentTime / audio.duration * 100)
                progress.value = progressPercent;
            }
        }

        // xu ly khi tua song
        progress.onchange = function(e) {
            const seekTime = audio.duration / 100 * e.target.value
            audio.currentTime = seekTime
        }

        // khi next bai hat
        nextBtn.onclick = function() {
            if (_this.isRandom) {
                _this.isRandomSong();
            } else {
                _this.nextSong();
            }
            audio.play();
            _this.render();
            _this.scrollToActiveSong();
        }

        // khi prev bai hat
        prevBtn.onclick = function() {
            if (_this.isRandom) {
                _this.isRandomSong();
            } else {
                _this.prevSong();
            }
            audio.play();
            _this.render();
            _this.scrollToActiveSong();
        }

        // khi random bai hat
        randomBtn.onclick = function(e) {
            _this.isRandom = !_this.isRandom
            randomBtn.classList.toggle('active', _this.isRandom)
        }

        //xu ly next song khi audio ended
        audio.onended = function() {
            if (_this.isRepeat) {
                audio.play();
            } else {
                nextBtn.click();
            }
        }

        //xu ly phat lai 1 lap lai song
        repeatBtn.onclick = function(e) {
            _this.isRepeat = !_this.isRepeat
            repeatBtn.classList.toggle('active', _this.isRepeat)
        }
    },



    loadCurrentSong: function() {

        heading.textContent = this.currentSong.name
        cdThumb.style.backgroundImage = `url('${this.currentSong.image}')`
        audio.scr = this.currentSong.path
    },

    scrollToActiveSong: function() {
        setTimeout(() => {
            $('.song.active').scrollIntoView({
                behavior: 'smooth',
                block: 'nearest',
            })
        }, 300)
    },

    nextSong: function() {
        this.currentIndex++
            if (this.currentIndex >= this.songs.length) {
                this.currentIndex = 0
            }
        this.loadCurrentSong()
    },

    prevSong: function() {
        this.currentIndex--
            if (this.currentIndex < 0) {
                this.currentIndex = this.songs.length - 1
            }
        this.loadCurrentSong()
    },

    playRandomSong: function() {
        let newIndex
        do {
            newIndex = Math.floor(Math.random() * this.songs.length)
        } while (newIndex === this.currentIndex)

        this.currentIndex = newIndex
        this.loadCurrentSong();
    },

    //bat dau len
    start: function() {
        // định nghĩa các thuộc tính cho object
        this.defineProperties();


        // lắng nghe/xử lý các sự kiện( DOM Events)
        this.handleEvents();

        //Tải thông tin bài hát đầu tiên vào  UI khi chạy ứng dụng
        this.loadCurrentSong();

        //Render playlist
        this.render();


    }
}

app.start();