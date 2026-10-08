import React, { useEffect, useRef, useState } from 'react';
import {
  AUDIO_FILE,
  BIRTHDAY_MESSAGE,
  BIRTHDAY_NAME,
  MEMORY_PHOTOS,
  SHAYARIS,
} from './birthdayContent.js';

const pad = (value) => String(value).padStart(2, '0');
const publicAsset = (path) => `${import.meta.env.BASE_URL}${path.replace(/^\/+/, '')}`;
const matchesCurrentTime = (value) => {
  const match = /^(\d{1,2}):(\d{2})$/.exec(value.trim());
  if (!match) return false;

  const hours = Number(match[1]);
  const minutes = Number(match[2]);
  if (hours > 23 || minutes > 59) return false;

  const now = new Date();
  const minuteOfDay = hours * 60 + minutes;
  const currentMinute = now.getHours() * 60 + now.getMinutes();
  const current12HourMinute = (now.getHours() % 12 || 12) * 60 + now.getMinutes();
  const isWithinOneMinute = (expectedMinute) => {
    const difference = Math.abs(minuteOfDay - expectedMinute);
    return Math.min(difference, 1440 - difference) <= 1;
  };

  return isWithinOneMinute(currentMinute) || isWithinOneMinute(current12HourMinute);
};

function Atmosphere({ count = 22, hearts = false }) {
  return (
    <div className={`atmosphere${hearts ? ' atmosphere--hearts' : ''}`} aria-hidden="true">
      {Array.from({ length: count }, (_, index) => (
        <span
          className={hearts ? 'float-heart' : 'twinkle'}
          key={index}
          style={{
            '--i': index,
            '--x': `${(index * 47 + 9) % 100}%`,
            '--y': `${(index * 19 + 7) % 100}%`,
            '--size': `${7 + (index % 4) * 3}px`,
            '--heart-size': `${13 + (index % 4) * 6}px`,
            '--delay': `${(index % 9) * -1.3}s`,
            '--duration': `${8 + (index % 8) * 1.7}s`,
          }}
        >
          {hearts ? (index % 3 === 0 ? '♥' : '♡') : '✦'}
        </span>
      ))}
    </div>
  );
}

function Confetti({ burst = false, once = false }) {
  return (
    <div className={`confetti${burst ? ' confetti--burst' : ''}${once ? ' confetti--once' : ''}`} aria-hidden="true">
      {Array.from({ length: 54 }, (_, index) => (
        <i
          key={index}
          style={{
            '--i': index,
            '--x': `${(index * 37 + 3) % 100}%`,
            '--hue': `${(index * 41 + 8) % 360}`,
            '--width': `${5 + (index % 4) * 2}px`,
            '--height': `${8 + (index % 5) * 2}px`,
            '--drift': `${(index % 2 === 0 ? -1 : 1) * (35 + (index % 6) * 16)}px`,
            '--rotation': `${500 + index * 40}deg`,
            '--fall-duration': `${3 + (index % 5) * 0.55}s`,
            '--burst-duration': `${1.9 + (index % 7) * 0.36}s`,
            '--once-delay': `${(index % 10) * 0.24}s`,
            '--delay': `${(index % 13) * -0.21}s`,
          }}
        />
      ))}
    </div>
  );
}

function Fireworks() {
  return (
    <div className="fireworks" aria-hidden="true">
      {[0, 1, 2, 3].map((burst) => (
        <span
          className={`firework firework--${burst + 1}`}
          key={burst}
          style={{ '--x': `${16 + ((burst * 31) % 69)}%`, '--y': `${18 + ((burst * 23) % 45)}%`, '--wait': `${burst * 0.65}s` }}
        >
          {Array.from({ length: 12 }, (_, ray) => (
            <i key={ray} style={{ '--ray': `${ray * 30}deg`, '--distance': `${24 + (ray % 4) * 8}px` }} />
          ))}
        </span>
      ))}
    </div>
  );
}

function Balloon({ className = '' }) {
  return (
    <span className={`balloon ${className}`} aria-hidden="true">
      <i />
    </span>
  );
}

function Cake({ cut = false, small = false }) {
  return (
    <div className={`cake${cut ? ' cake--cut' : ''}${small ? ' cake--small' : ''}`} aria-label="Birthday cake">
      <div className="candles" aria-hidden="true">
        {[0, 1, 2].map((candle) => (
          <span className="candle" key={candle} style={{ '--candle': candle }}>
            <i className="flame" />
          </span>
        ))}
      </div>
      <div className="cake-top">
        <span className="icing-drip drip-one" />
        <span className="icing-drip drip-two" />
        <span className="icing-drip drip-three" />
        <span className="cake-berry berry-one">✿</span>
        <span className="cake-berry berry-two">✿</span>
        <span className="cake-berry berry-three">✿</span>
      </div>
      <div className="cake-layer cake-layer--top" />
      <div className="cake-layer cake-layer--bottom" />
      <div className="cake-plate" />
      {cut && <span className="cake-slice">🍰</span>}
    </div>
  );
}

function Button({ children, onClick, secondary = false, className = '', ...props }) {
  return (
    <button
      className={`button${secondary ? ' button--secondary' : ''} ${className}`}
      onClick={onClick}
      {...props}
    >
      {children}
    </button>
  );
}

function Countdown({ onComplete }) {
  const [seconds, setSeconds] = useState(60);
  useEffect(() => {
    if (seconds === 0) {
      const transition = window.setTimeout(onComplete, 1200);
      return () => window.clearTimeout(transition);
    }
    const timer = window.setTimeout(() => setSeconds((value) => value - 1), 1000);
    return () => window.clearTimeout(timer);
  }, [seconds, onComplete]);

  return (
    <main className="screen countdown-screen">
      <Atmosphere count={36} hearts />
      <div className="countdown-orbit orbit-one" aria-hidden="true" />
      <div className="countdown-orbit orbit-two" aria-hidden="true" />
      <Balloon className="balloon--one" />
      <Balloon className="balloon--two" />
      <div className="countdown-content">
        <span className="eyebrow"><span className="eyebrow-line" />A LITTLE BIRTHDAY MAGIC<span className="eyebrow-line" /></span>
        <div className="tiny-heart" aria-hidden="true">♥</div>
        <h1 className="countdown-title">Something Special<br />Is Waiting For You... <span>❤️</span></h1>
        <div className={`countdown-number${seconds === 0 ? ' countdown-number--zero' : ''}`} aria-live="polite">
          {seconds}
        </div>
        <p className="countdown-caption">Just wait a little... your surprise is getting ready <span>🎁</span></p>
        <div className="countdown-progress" aria-hidden="true"><i style={{ transform: `scaleX(${(60 - seconds) / 60})` }} /></div>
        {seconds === 0 && <><Confetti burst /><Fireworks /></>}
      </div>
      <span className="side-note">MADE WITH LOVE · JUST FOR YOU</span>
    </main>
  );
}

function Welcome({ onNext }) {
  return (
    <main className="screen welcome-screen">
      <Atmosphere count={28} hearts />
      <Confetti once />
      <div className="welcome-wash" aria-hidden="true" />
      <Balloon className="balloon--one" />
      <Balloon className="balloon--two" />
      <Balloon className="balloon--three" />
      <div className="welcome-layout">
        <div className="welcome-copy">
          <span className="eyebrow"><span className="eyebrow-line" />A DAY AS LOVELY AS YOU<span className="eyebrow-line" /></span>
          <h1>Happy Birthday<br /><em>{BIRTHDAY_NAME}</em> <span className="heading-heart">♥</span></h1>
          <p className="welcome-subtitle">Today is all about celebrating you.</p>
          <p className="welcome-message">May your special day be filled with happiness, smiles and unforgettable moments. <span>❤️</span></p>
          <Button onClick={onNext}>Next <span className="button-arrow">→</span></Button>
        </div>
        <div className="cake-stage" aria-label="A birthday cake with glowing candles">
          <div className="cake-halo" />
          <span className="cake-sparkle sparkle-a">✧</span>
          <span className="cake-sparkle sparkle-b">✦</span>
          <span className="cake-sparkle sparkle-c">✧</span>
          <Cake />
          <span className="cake-caption">a little sweetness for your day</span>
        </div>
      </div>
      <div className="welcome-footer"><span>01 / 06</span><span className="footer-rule" /><span>YOUR BIRTHDAY STORY</span></div>
    </main>
  );
}

function CakeCutting({ onNext }) {
  const [cut, setCut] = useState(false);
  const [musicOn, setMusicOn] = useState(false);
  const audioRef = useRef(null);
  const hasAudio = AUDIO_FILE !== 'PLACEHOLDER_AUDIO';

  useEffect(() => {
    return () => {
      audioRef.current?.pause();
    };
  }, []);

  const cutCake = () => {
    setCut(true);
    if (!hasAudio || !audioRef.current) return;

    // SONG STARTS AFTER CAKE IS CUT
    audioRef.current.play()
      .then(() => setMusicOn(true))
      .catch((error) => {
        console.warn('Birthday music could not be played.', error);
        setMusicOn(false);
      });
  };

  const toggleMusic = async () => {
    if (!cut || !hasAudio || !audioRef.current) return;
    if (musicOn) {
      audioRef.current.pause();
      setMusicOn(false);
      return;
    }
    try {
      await audioRef.current.play();
      setMusicOn(true);
    } catch {
      console.warn('Birthday music could not be resumed.');
      setMusicOn(false);
    }
  };

  return (
    <main className={`screen cutting-screen${cut ? ' cutting-screen--celebrate' : ''}`}>
      <Atmosphere count={25} hearts={cut} />
      {cut && <><Confetti burst /><Fireworks /></>}
      {hasAudio && <audio ref={audioRef} src={publicAsset(AUDIO_FILE)} loop preload="none" onError={() => { console.warn('Birthday music file could not be loaded.'); setMusicOn(false); }} />}
      <div className="page-topline"><span>03 / 06</span><span>A MOMENT TO MAKE A WISH</span></div>
      <section className="cutting-content">
        <span className="eyebrow">THE SWEETEST PART</span>
        <h1>Now It’s Time To<br /><em>Cut The Cake</em> <span>🎂</span></h1>
        <p className="page-intro">Make a wish, Riyu. This little celebration is all yours.</p>
        <div className={`cutting-stage${cut ? ' cutting-stage--cut' : ''}`}>
          <div className="cutting-glow" />
          <Cake cut={cut} />
          {!cut && (
            <button className="cake-knife" aria-label="Cut the cake with the knife" onClick={cutCake}>
              <span className="knife-handle" /><span className="knife-blade" />
            </button>
          )}
          {cut && <span className="cut-sparkle cut-sparkle--one">✦</span>}
          {cut && <span className="cut-sparkle cut-sparkle--two">✧</span>}
        </div>
        {!cut ? (
          <Button onClick={cutCake} className="cut-button">Cut The Cake <span>✂</span></Button>
        ) : (
          <>
            <p className="cut-success">Yay! The cake is cut! 🎉❤️</p>
            <Button onClick={onNext}>Next <span className="button-arrow">→</span></Button>
          </>
        )}
        <button
          className={`music-control${musicOn ? ' music-control--on' : ''}`}
          onClick={toggleMusic}
          disabled={!hasAudio || !cut}
          aria-pressed={musicOn}
          title={hasAudio ? 'Toggle birthday music' : 'Add an audio file in src/birthdayContent.js to enable music'}
        >
          <span>{musicOn ? '♫' : '♪'}</span>
          {hasAudio ? (musicOn ? 'Music On' : 'Music Off') : 'Music · add your song'}
        </button>
      </section>
    </main>
  );
}

function Secret({ onUnlock }) {
  const [password, setPassword] = useState('');
  const [message, setMessage] = useState('');
  const [unlocking, setUnlocking] = useState(false);
  const unlock = (event) => {
    event.preventDefault();
    if (!matchesCurrentTime(password)) {
      setMessage('Almost... Try again ❤️');
      return;
    }
    setMessage('');
    setUnlocking(true);
    window.setTimeout(onUnlock, 1200);
  };

  return (
    <main className={`screen secret-screen${unlocking ? ' secret-screen--unlocking' : ''}`}>
      <Atmosphere count={24} />
      {unlocking && <Confetti burst />}
      <div className="page-topline"><span>04 / 06</span><span>A SECRET, JUST FOR YOU</span></div>
      <section className="secret-card">
        <div className="lock-emblem" aria-hidden="true">
          <span className="lock-halo" /><span className="lock-shackle" /><span className="lock-body">♥</span>
        </div>
        <span className="eyebrow">A TINY MYSTERY</span>
        <h1>One More Little<br /><em>Secret...</em> <span>🔐</span></h1>
        <p className="page-intro">Only someone special can unlock this.</p>
        <form className="secret-form" onSubmit={unlock}>
          <label className="visually-hidden" htmlFor="birthday-password">Enter the current time</label>
          <input
            id="birthday-password"
            type="text"
            inputMode="numeric"
            autoComplete="off"
            maxLength={5}
            placeholder="Enter the current time"
            value={password}
            onChange={(event) => {
              setPassword(event.target.value);
              setMessage('');
            }}
          />
          <Button type="submit">Unlock <span>✧</span></Button>
        </form>
        <p className={`secret-feedback${message ? ' secret-feedback--visible' : ''}`} aria-live="polite">{message || 'A little clue: use your current local time in HH:MM format.'}</p>
        <span className="secret-decoration secret-decoration--left">✧</span>
        <span className="secret-decoration secret-decoration--right">✦</span>
      </section>
    </main>
  );
}

function Gallery({ onNext }) {
  const [selectedPhoto, setSelectedPhoto] = useState(null);
  useEffect(() => {
    if (!selectedPhoto) return undefined;
    const closeOnEscape = (event) => {
      if (event.key === 'Escape') setSelectedPhoto(null);
    };
    window.addEventListener('keydown', closeOnEscape);
    document.body.classList.add('modal-open');
    return () => {
      window.removeEventListener('keydown', closeOnEscape);
      document.body.classList.remove('modal-open');
    };
  }, [selectedPhoto]);

  return (
    <main className="screen gallery-screen">
      <Atmosphere count={19} />
      <div className="page-topline"><span>05 / 06</span><span>THE LITTLE THINGS WE KEEP</span></div>
      <section className="gallery-content">
        <span className="eyebrow">A COLLECTION OF LITTLE JOYS</span>
        <h1>Beautiful <em>Memories</em> <span>📸</span></h1>
        <p className="page-intro">Some moments are too special to be forgotten.</p>
        <div className="memory-grid">
          {MEMORY_PHOTOS.map((photo, index) => {
            const imageAdded = photo.src && !photo.src.startsWith('PLACEHOLDER_');
            return (
              <button
                className={`memory-card memory-card--${index + 1}`}
                key={photo.label}
                onClick={() => setSelectedPhoto(photo)}
                aria-label={`Open ${photo.label}`}
                style={{ '--tilt': `${[-2, 1.5, -1, 2, -1.5, 1][index]}deg` }}
              >
                <span className="memory-image">
                  {imageAdded ? <img src={publicAsset(photo.src)} alt={photo.note} /> : <span className="memory-placeholder"><i>✿</i><b>{String(index + 1).padStart(2, '0')}</b><small>your photo goes here</small></span>}
                  <span className="memory-zoom">↗</span>
                </span>
                <span className="memory-caption"><strong>{photo.label}</strong><small>{photo.note}</small></span>
              </button>
            );
          })}
        </div>
        <Button onClick={onNext}>Next <span className="button-arrow">→</span></Button>
      </section>
      {selectedPhoto && (
        <div className="lightbox" role="dialog" aria-modal="true" aria-label={selectedPhoto.label} onClick={() => setSelectedPhoto(null)}>
          <button className="lightbox-close" aria-label="Close photo preview" onClick={() => setSelectedPhoto(null)}>×</button>
          <div className="lightbox-card" onClick={(event) => event.stopPropagation()}>
            {selectedPhoto.src && !selectedPhoto.src.startsWith('PLACEHOLDER_')
              ? <img src={publicAsset(selectedPhoto.src)} alt={selectedPhoto.note} />
              : <div className="lightbox-placeholder"><span>✿</span><strong>{selectedPhoto.label}</strong><small>Replace {selectedPhoto.src} in src/birthdayContent.js with a photo path.</small></div>}
            <p>{selectedPhoto.label} <span>·</span> {selectedPhoto.note}</p>
          </div>
        </div>
      )}
    </main>
  );
}

function Finale() {
  const [typed, setTyped] = useState('');
  const [celebrating, setCelebrating] = useState(false);
  const [showPoems, setShowPoems] = useState(false);

  useEffect(() => {
    let index = 0;
    const timer = window.setInterval(() => {
      index += 2;
      setTyped(BIRTHDAY_MESSAGE.slice(0, index));
      if (index >= BIRTHDAY_MESSAGE.length) {
        window.clearInterval(timer);
        setShowPoems(true);
        window.setTimeout(() => setCelebrating(true), 500);
      }
    }, 34);
    return () => window.clearInterval(timer);
  }, []);

  return (
    <main className={`screen finale-screen${celebrating ? ' finale-screen--celebrate' : ''}`}>
      <Atmosphere count={35} hearts={celebrating} />
      {celebrating && <><Confetti burst /><Fireworks /></>}
      <div className="finale-glow" />
      <div className="finale-content">
        <div className="page-topline"><span>06 / 06</span><span>WITH ALL MY LOVE</span></div>
        <span className="eyebrow">A NOTE FROM THE HEART</span>
        <h1>For You, <em>{BIRTHDAY_NAME}</em> <span>❤️</span></h1>
        <div className="message-card">
          <span className="quote-mark">“</span>
          <p>{typed}<span className="typing-cursor" aria-hidden="true">|</span></p>
        </div>
        <div className={`shayari-grid${showPoems ? ' shayari-grid--visible' : ''}`}>
          {SHAYARIS.map((poem, index) => (
            <blockquote className="shayari-card" key={poem}>
              <span className="poem-flower" aria-hidden="true">{index === 0 ? '✿' : '✧'}</span>
              <p>{poem}</p>
            </blockquote>
          ))}
        </div>
        {celebrating ? (
          <div className="final-celebration">
            <span className="once-again">Once Again...</span>
            <h2>Happy Birthday<br /><em>{BIRTHDAY_NAME}</em> <span>❤️🎂</span></h2>
            <div className="final-cake"><Cake small /></div>
            <button className="button replay-button" onClick={() => window.dispatchEvent(new Event('birthday:replay'))}>Replay The Surprise <span>🔄</span></button>
          </div>
        ) : (
          <p className="final-note">Every lovely story deserves one more page. <span>✨</span></p>
        )}
      </div>
    </main>
  );
}

export default function App() {
  const [page, setPage] = useState(0);
  const [transitionKey, setTransitionKey] = useState(0);

  const goTo = (nextPage) => {
    setPage(nextPage);
    setTransitionKey((key) => key + 1);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  useEffect(() => {
    const replay = () => goTo(0);
    window.addEventListener('birthday:replay', replay);
    return () => window.removeEventListener('birthday:replay', replay);
  }, []);

  const screens = [
    <Countdown onComplete={() => goTo(1)} />,
    <Welcome onNext={() => goTo(2)} />,
    <CakeCutting onNext={() => goTo(3)} />,
    <Secret onUnlock={() => goTo(4)} />,
    <Gallery onNext={() => goTo(5)} />,
    <Finale />,
  ];

  return <div className="app-shell"><div className="screen-transition" key={transitionKey}>{screens[page]}</div></div>;
}
