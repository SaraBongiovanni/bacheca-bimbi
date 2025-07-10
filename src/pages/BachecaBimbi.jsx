import React, { useState, useRef, useEffect } from 'react';
import Bambino from '../components/Bambino';
import { useNavigate } from 'react-router-dom';

const momenti = {
  mattino: '🌞',
  pomeriggio: '🌤️',
  sera: '🌙',
};

const BachecaBimbi = () => {
  const navigate = useNavigate();

  const refBambino1 = useRef(null);
  const refBambino2 = useRef(null);

  const safeParse = (key, fallback) => {
    try {
      const val = localStorage.getItem(key);
      if (!val) return fallback;
      return JSON.parse(val);
    } catch {
      return fallback;
    }
  };

  const [nomi] = useState(() =>
    safeParse('nomiBambini', {
      bambino1: 'Bambino 1',
      bambino2: 'Bambino 2',
    })
  );

  const [emojiBambini] = useState(() =>
    safeParse('emojiBambini', {
      bambino1: '👦',
      bambino2: '👧',
    })
  );

  const [incarichiAssegnati] = useState(() =>
    safeParse('incarichiAssegnati', {
      bambino1: { mattino: {}, pomeriggio: {}, sera: {} },
      bambino2: { mattino: {}, pomeriggio: {}, sera: {} },
    })
  );

  const [incarichiDisponibili, setIncarichiDisponibili] = useState(() =>
    safeParse('incarichiDisponibili', [])
  );

  const [incarichiCompletati, setIncarichiCompletati] = useState(() =>
    safeParse('incarichiCompletati', {
      bambino1: { mattino: {}, pomeriggio: {}, sera: {} },
      bambino2: { mattino: {}, pomeriggio: {}, sera: {} },
    })
  );

  const [punteggioAccumulato, setPunteggioAccumulato] = useState(() =>
    safeParse('punteggioAccumulato', {
      bambino1: 0,
      bambino2: 0,
    })
  );

  useEffect(() => {
    localStorage.setItem('incarichiCompletati', JSON.stringify(incarichiCompletati));
  }, [incarichiCompletati]);

  useEffect(() => {
    localStorage.setItem('punteggioAccumulato', JSON.stringify(punteggioAccumulato));
  }, [punteggioAccumulato]);

  const setIncarichiCompletatiGlobal = (bambinoId, nuoviCompletati) => {
    setIncarichiCompletati((prev) => ({
      ...prev,
      [bambinoId]: nuoviCompletati,
    }));
  };

  const tuttiCompletati = (bambinoId, momento) => {
    const incarichi = incarichiAssegnati[bambinoId][momento] || {};
    const nomiIncarichi = Object.keys(incarichi);
    if (nomiIncarichi.length === 0) return false;
    return nomiIncarichi.every((nome) => incarichiCompletati[bambinoId]?.[momento]?.[nome]);
  };

  useEffect(() => {
    const premiati = safeParse('momentiPremiati', {
      bambino1: { mattino: false, pomeriggio: false, sera: false },
      bambino2: { mattino: false, pomeriggio: false, sera: false },
    });

    const nuovoPunteggio = { ...punteggioAccumulato };
    const nuovoPremiati = { ...premiati };

    ['bambino1', 'bambino2'].forEach((bambinoId) => {
      Object.keys(momenti).forEach((momento) => {
        const completato = tuttiCompletati(bambinoId, momento);
        if (completato && !premiati[bambinoId][momento]) {
          nuovoPunteggio[bambinoId] += 10;
          nuovoPremiati[bambinoId][momento] = true;
        } else if (!completato && premiati[bambinoId][momento]) {
          nuovoPremiati[bambinoId][momento] = false;
        }
      });

      Object.entries(incarichiCompletati[bambinoId] || {}).forEach(([momento, completati]) => {
        Object.keys(completati).forEach((nomeIncarico) => {
          const chiave = `bonusMulte-${bambinoId}-${momento}-${nomeIncarico}`;
          if (localStorage.getItem(chiave)) return;

          const incarico = incarichiDisponibili.find((i) => i.nome === nomeIncarico);
          if (!incarico) return;

          if (incarico.bonus) {
            nuovoPunteggio[bambinoId] += 10;
          }
          if (incarico.multa) {
            nuovoPunteggio[bambinoId] -= 10;
          }

          localStorage.setItem(chiave, 'true');
        });
      });
    });

    setPunteggioAccumulato(nuovoPunteggio);
    localStorage.setItem('momentiPremiati', JSON.stringify(nuovoPremiati));
  }, [incarichiCompletati]);

  const resetCompletamenti = () => {
    const vuoto = { mattino: {}, pomeriggio: {}, sera: {} };
    setIncarichiCompletati({
      bambino1: vuoto,
      bambino2: vuoto,
    });

    const premiatiReset = {
      bambino1: { mattino: false, pomeriggio: false, sera: false },
      bambino2: { mattino: false, pomeriggio: false, sera: false },
    };
    localStorage.setItem('momentiPremiati', JSON.stringify(premiatiReset));

    Object.keys(localStorage)
      .filter((k) => k.startsWith('bonusMulte-'))
      .forEach((k) => localStorage.removeItem(k));
  };

  const resetPunteggi = () => {
    resetCompletamenti();
    const resetPunti = { bambino1: 0, bambino2: 0 };
    setPunteggioAccumulato(resetPunti);
    localStorage.setItem('punteggioAccumulato', JSON.stringify(resetPunti));
  };

  return (
    <div className="bacheca" style={{ padding: '1rem' }}>
      <div
        className="colonne"
        style={{
          display: 'flex',
          gap: '2rem',
          justifyContent: 'center',
          alignItems: 'flex-start',
          flexDirection: 'row',
        }}
      >
        <div style={{ flex: 1, display: 'flex', flexDirection: 'column' }}>
          <Bambino
            ref={refBambino1}
            bambinoId="bambino1"
            nome={nomi.bambino1}
            emoji={emojiBambini.bambino1}
            momenti={momenti}
            incarichiAssegnati={incarichiAssegnati.bambino1}
            incarichiDisponibili={incarichiDisponibili}
            setIncarichiDisponibili={setIncarichiDisponibili}
            incarichiCompletati={incarichiCompletati.bambino1}
            setIncarichiCompletatiGlobal={setIncarichiCompletatiGlobal}
            punteggioAccumulato={punteggioAccumulato.bambino1}
            setPunteggioAccumulato={setPunteggioAccumulato}
          />
        </div>
        <div style={{ flex: 1, display: 'flex', flexDirection: 'column' }}>
          <Bambino
            ref={refBambino2}
            bambinoId="bambino2"
            nome={nomi.bambino2}
            emoji={emojiBambini.bambino2}
            momenti={momenti}
            incarichiAssegnati={incarichiAssegnati.bambino2}
            incarichiDisponibili={incarichiDisponibili}
            setIncarichiDisponibili={setIncarichiDisponibili}
            incarichiCompletati={incarichiCompletati.bambino2}
            setIncarichiCompletatiGlobal={setIncarichiCompletatiGlobal}
            punteggioAccumulato={punteggioAccumulato.bambino2}
            setPunteggioAccumulato={setPunteggioAccumulato}
          />
        </div>
      </div>

      <div style={{ marginTop: '1.5rem', textAlign: 'center' }}>
        <button onClick={() => navigate('/genitori')} style={{ marginRight: '1rem' }}>
          Area Genitori
        </button>
        <button onClick={resetCompletamenti} style={{ marginRight: '1rem' }}>
          Reset Completamenti
        </button>
        <button onClick={resetPunteggi}>Reset Punteggi</button>
      </div>
    </div>
  );
};

export default BachecaBimbi;