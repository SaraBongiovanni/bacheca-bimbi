import React, { useState, useEffect } from 'react';
import incarichiBase from '../components/incarichi';
import Bambino from '../components/Bambino';

const momenti = {
  mattino: '☀️',
  pomeriggio: '🌤️',
  sera: '🌙',
};

const AreaGenitori = () => {
  const [nomiBambini, setNomiBambini] = useState(() =>
    JSON.parse(localStorage.getItem('nomiBambini')) || {
      bambino1: 'Bambino 1',
      bambino2: 'Bambino 2',
    }
  );

  const [emojiBambini, setEmojiBambini] = useState(() =>
    JSON.parse(localStorage.getItem('emojiBambini')) || {
      bambino1: '👦',
      bambino2: '👧',
    }
  );

  const [incarichiDisponibili, setIncarichiDisponibili] = useState(() =>
    JSON.parse(localStorage.getItem('incarichiDisponibili')) || incarichiBase
  );

  const [incarichiAssegnati, setIncarichiAssegnati] = useState(() =>
    JSON.parse(localStorage.getItem('incarichiAssegnati')) || {
      bambino1: { mattino: {}, pomeriggio: {}, sera: {} },
      bambino2: { mattino: {}, pomeriggio: {}, sera: {} },
    }
  );

  useEffect(() => {
    localStorage.setItem('nomiBambini', JSON.stringify(nomiBambini));
  }, [nomiBambini]);

  useEffect(() => {
    localStorage.setItem('emojiBambini', JSON.stringify(emojiBambini));
  }, [emojiBambini]);

  useEffect(() => {
    localStorage.setItem('incarichiDisponibili', JSON.stringify(incarichiDisponibili));
  }, [incarichiDisponibili]);

  useEffect(() => {
    localStorage.setItem('incarichiAssegnati', JSON.stringify(incarichiAssegnati));
  }, [incarichiAssegnati]);

  const cambiaNomeBambino = (bambino, nuovoNome) => {
    setNomiBambini((prev) => ({
      ...prev,
      [bambino]: nuovoNome,
    }));
  };

  const cambiaEmojiBambino = (bambino, nuovaEmoji) => {
    setEmojiBambini((prev) => ({
      ...prev,
      [bambino]: nuovaEmoji,
    }));
  };

  const toggleIncarico = (bambino, momento, nomeIncarico) => {
    setIncarichiAssegnati((prev) => {
      const nuovo = { ...prev };
      nuovo[bambino] = { ...prev[bambino] };
      nuovo[bambino][momento] = { ...prev[bambino][momento] };

      if (nuovo[bambino][momento][nomeIncarico]) {
        delete nuovo[bambino][momento][nomeIncarico];
      } else {
        nuovo[bambino][momento][nomeIncarico] = true;
      }
      return nuovo;
    });
  };

  const eliminaIncaricoDefinitivo = (nomeIncarico) => {
    if (!window.confirm(`Eliminare definitivamente "${nomeIncarico}" da tutti gli incarichi?`)) return;

    setIncarichiDisponibili((prev) => prev.filter(i => i.nome !== nomeIncarico));

    setIncarichiAssegnati((prev) => {
      const nuovo = { bambino1: {}, bambino2: {} };
      ['bambino1', 'bambino2'].forEach((bambino) => {
        nuovo[bambino] = {};
        Object.keys(prev[bambino]).forEach((momento) => {
          nuovo[bambino][momento] = { ...prev[bambino][momento] };
          if (nuovo[bambino][momento][nomeIncarico]) {
            delete nuovo[bambino][momento][nomeIncarico];
          }
        });
      });
      return nuovo;
    });
  };

  const aggiungiIncarico = () => {
    const nome = prompt("Nome nuovo incarico (es. 'Fare merenda'):");
    if (!nome || !nome.trim()) return alert("Nome non valido!");

    if (incarichiDisponibili.some(i => i.nome.toLowerCase() === nome.trim().toLowerCase())) {
      return alert("Incarico già esistente!");
    }

    const emoji = prompt("Emoji per il nuovo incarico (es. 🍎):") || '✅';
    const multa = window.confirm("Questo incarico è una multa? (Se sì, sottrarrà 5 punti)");

    setIncarichiDisponibili((prev) => [...prev, { nome: nome.trim(), emoji, multa }]);
  };

  const resetIncarichiAssegnati = (bambino) => {
    setIncarichiAssegnati((prev) => ({
      ...prev,
      [bambino]: { mattino: {}, pomeriggio: {}, sera: {} },
    }));
  };

  const calcolaPunteggio = (bambino) => {
    let punti = 0;
    Object.entries(momenti).forEach(([momentoKey]) => {
      const incarichiMomento = incarichiAssegnati[bambino][momentoKey] || {};
      const nomiIncarichi = Object.keys(incarichiMomento);
      if (nomiIncarichi.length === 0) return;
      const tuttiCompletati = false; // da integrare se necessario
      if (tuttiCompletati) punti += 10;
      nomiIncarichi.forEach(nome => {
        const incarico = incarichiDisponibili.find(i => i.nome === nome);
        if (!incarico) return;
        punti += incarico.multa ? -5 : 5;
      });
    });
    return punti;
  };

  const renderIncaricoAssegnazione = (bambino, momento, { nome, emoji, multa }) => {
    const assegnato = !!incarichiAssegnati[bambino][momento]?.[nome];
    return (
      <div
        key={nome}
        onClick={() => toggleIncarico(bambino, momento, nome)}
        style={{
          cursor: 'pointer',
          userSelect: 'none',
          padding: '5px 8px',
          margin: '3px 0',
          borderRadius: 5,
          backgroundColor: assegnato ? (multa ? '#f8d7da' : '#d4edda') : '#f8f9fa',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          border: assegnato ? `2px solid ${multa ? '#dc3545' : '#28a745'}` : '1px solid #ccc',
          fontWeight: assegnato ? '600' : '400',
          color: multa ? '#721c24' : 'inherit',
        }}
        title={assegnato ? 'Clicca per rimuovere incarico' : 'Clicca per assegnare incarico'}
      >
        <span>
          {assegnato ? '✔️ ' : ''} {emoji} {nome} {multa && '🚫'}
        </span>
        <button
          onClick={(e) => {
            e.stopPropagation();
            eliminaIncaricoDefinitivo(nome);
          }}
          style={{
            background: 'transparent',
            border: 'none',
            color: 'red',
            fontWeight: 'bold',
            cursor: 'pointer',
            marginLeft: 10,
            fontSize: '1rem',
          }}
          aria-label={`Elimina incarico ${nome}`}
        >
          ×
        </button>
      </div>
    );
  };

  return (
    <div style={{ padding: '1rem' }}>
      <h1>Area Genitori</h1>

      <div style={{ display: 'flex', gap: '2rem' }}>
        {/* Bambino 1 */}
        <div style={{ flex: 1 }}>
          <input
            type="text"
            value={nomiBambini.bambino1}
            onChange={(e) => cambiaNomeBambino('bambino1', e.target.value)}
            placeholder="Nome bambino 1"
            style={{ fontSize: '1.2rem', marginBottom: '0.5rem', width: '100%' }}
          />
          <input
            type="text"
            value={emojiBambini.bambino1}
            onChange={(e) => cambiaEmojiBambino('bambino1', e.target.value)}
            placeholder="Emoji 👦"
            style={{ fontSize: '1.2rem', marginBottom: '1rem', width: '100%' }}
          />
          <h2>Incarichi assegnabili a {nomiBambini.bambino1}</h2>
          {Object.entries(momenti).map(([momentoKey, emojiMomento]) => (
            <div key={momentoKey} style={{ marginBottom: '1.5rem' }}>
              <h3>{emojiMomento} {momentoKey.charAt(0).toUpperCase() + momentoKey.slice(1)}</h3>
              {incarichiDisponibili.map(i => renderIncaricoAssegnazione('bambino1', momentoKey, i))}
            </div>
          ))}
          <button onClick={aggiungiIncarico} style={{ marginRight: 10, marginTop: 10 }}>
            + Aggiungi incarico
          </button>
          <button onClick={() => resetIncarichiAssegnati('bambino1')} style={{ marginTop: 10 }}>
            Reset incarichi assegnati
          </button>
          <div style={{ marginTop: 20, fontWeight: '700' }}>
            Punteggio totale: {calcolaPunteggio('bambino1')}
          </div>
        </div>

        {/* Bambino 2 */}
        <div style={{ flex: 1 }}>
          <input
            type="text"
            value={nomiBambini.bambino2}
            onChange={(e) => cambiaNomeBambino('bambino2', e.target.value)}
            placeholder="Nome bambino 2"
            style={{ fontSize: '1.2rem', marginBottom: '0.5rem', width: '100%' }}
          />
          <input
            type="text"
            value={emojiBambini.bambino2}
            onChange={(e) => cambiaEmojiBambino('bambino2', e.target.value)}
            placeholder="Emoji 👧"
            style={{ fontSize: '1.2rem', marginBottom: '1rem', width: '100%' }}
          />
          <h2>Incarichi assegnabili a {nomiBambini.bambino2}</h2>
          {Object.entries(momenti).map(([momentoKey, emojiMomento]) => (
            <div key={momentoKey} style={{ marginBottom: '1.5rem' }}>
              <h3>{emojiMomento} {momentoKey.charAt(0).toUpperCase() + momentoKey.slice(1)}</h3>
              {incarichiDisponibili.map(i => renderIncaricoAssegnazione('bambino2', momentoKey, i))}
            </div>
          ))}
          <button onClick={aggiungiIncarico} style={{ marginRight: 10, marginTop: 10 }}>
            + Aggiungi incarico
          </button>
          <button onClick={() => resetIncarichiAssegnati('bambino2')} style={{ marginTop: 10 }}>
            Reset incarichi assegnati
          </button>
          <div style={{ marginTop: 20, fontWeight: '700' }}>
            Punteggio totale: {calcolaPunteggio('bambino2')}
          </div>
        </div>
      </div>
    </div>
  );
};

export default AreaGenitori;
