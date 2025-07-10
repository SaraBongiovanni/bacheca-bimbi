import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

const HomePage = () => {
  const navigate = useNavigate();
  const [deferredPrompt, setDeferredPrompt] = useState(null);
  const [showInstallBtn, setShowInstallBtn] = useState(false);

  useEffect(() => {
    const handler = (e) => {
      e.preventDefault();
      setDeferredPrompt(e);
      setShowInstallBtn(true);
    };

    window.addEventListener('beforeinstallprompt', handler);

    return () => {
      window.removeEventListener('beforeinstallprompt', handler);
    };
  }, []);

  const handleInstallClick = () => {
    if (!deferredPrompt) return;

    deferredPrompt.prompt();

    deferredPrompt.userChoice.then((choiceResult) => {
      if (choiceResult.outcome === 'accepted') {
        console.log('User accepted the install prompt');
      } else {
        console.log('User dismissed the install prompt');
      }

      setDeferredPrompt(null);
      setShowInstallBtn(false);
    });
  };

  return (
    <div style={{ textAlign: 'center', padding: '2rem' }}>
      <h1>Bacheca Bimbi</h1>
      <p>Benvenuto! Gestisci gli incarichi dei tuoi bambini in modo divertente.</p>

      <div style={{ marginTop: '2rem' }}>
        <button
          onClick={() => navigate('/bacheca')}
          style={{
            padding: '1rem 2rem',
            marginRight: '1rem',
            fontSize: '1rem',
            cursor: 'pointer',
          }}
        >
          Vai alla Bacheca
        </button>

        {showInstallBtn ? (
          <button
            onClick={handleInstallClick}
            style={{
              padding: '1rem 2rem',
              fontSize: '1rem',
              cursor: 'pointer',
            }}
          >
            Scarica App
          </button>
        ) : (
          <button
            disabled
            style={{
              padding: '1rem 2rem',
              fontSize: '1rem',
              cursor: 'not-allowed',
              opacity: 0.5,
            }}
            title="L'app non è ancora installabile"
          >
            Scarica App
          </button>
        )}
      </div>
    </div>
  );
};

export default HomePage;
