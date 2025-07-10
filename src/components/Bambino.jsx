import React from 'react';

const momenti = {
  mattino: '☀️',
  pomeriggio: '🌤️',
  sera: '🌙',
};

const Bambino = ({
  bambinoId,
  nome,
  emoji,
  incarichiDisponibili,
  incarichiAssegnati,
  incarichiCompletati,
  setIncarichiCompletatiGlobal,
  punteggioAccumulato,
  setPunteggioAccumulato, // ✅ nuovo prop per modificare punteggio
}) => {
  // ✅ Completamento incarico
  const toggleCompletato = (momento, nomeIncarico) => {
    const nuovo = { ...incarichiCompletati };
    if (!nuovo[momento]) nuovo[momento] = {};

    if (nuovo[momento][nomeIncarico]) {
      delete nuovo[momento][nomeIncarico];
    } else {
      nuovo[momento][nomeIncarico] = true;
    }

    setIncarichiCompletatiGlobal(bambinoId, nuovo);
  };

  // ✅ Bonus o Multa: modifica diretta del punteggio
  const modificaPunti = (delta) => {
    setPunteggioAccumulato((prev) => ({
      ...prev,
      [bambinoId]: prev[bambinoId] + delta,
    }));
  };

  // ✅ Verifica se tutti completati
  const tuttiCompletati = (momento) => {
    const incarichi = incarichiAssegnati[momento] || {};
    const nomiIncarichi = Object.keys(incarichi);
    if (nomiIncarichi.length === 0) return false;
    return nomiIncarichi.every((nome) => incarichiCompletati[momento]?.[nome]);
  };

  return (
    <div
      style={{
        border: '2px solid #888',
        borderRadius: 8,
        padding: 16,
        marginBottom: 20,
        userSelect: 'none',
      }}
    >
      <h2>
        {emoji} {nome}
      </h2>

      {/* ⭐🚫 PULSANTI BONUS E MULTA */}
      <div style={{ marginBottom: '1rem', display: 'flex', gap: '1rem' }}>
        <button
          onClick={() => modificaPunti(10)}
          style={{
            cursor: 'pointer',
            padding: '6px 12px',
            borderRadius: 6,
            backgroundColor: '#ffecb3',
            border: '1px solid #f0c419',
            fontWeight: '700',
          }}
          title="+10 punti extra"
        >
          ⭐ +10 punti
        </button>
        <button
          onClick={() => modificaPunti(-10)}
          style={{
            cursor: 'pointer',
            padding: '6px 12px',
            borderRadius: 6,
            backgroundColor: '#f8d7da',
            border: '1px solid #dc3545',
            fontWeight: '700',
          }}
          title="-10 punti di penalità"
        >
          🚫 -10 punti
        </button>
      </div>

      {/* INCARICHI PER MOMENTI */}
      {Object.entries(momenti).map(([momentoKey, emojiMomento]) => {
        const incarichi = incarichiAssegnati[momentoKey] || {};
        const nomiIncarichi = Object.keys(incarichi);

        return (
          <div key={momentoKey} style={{ marginBottom: '1.5rem' }}>
            <h3>
              {emojiMomento} {momentoKey.charAt(0).toUpperCase() + momentoKey.slice(1)}
            </h3>

            {nomiIncarichi.length === 0 ? (
              <p style={{ fontStyle: 'italic', color: '#666' }}>Nessun incarico assegnato</p>
            ) : (
              nomiIncarichi.map((nomeIncarico) => {
                const completato = incarichiCompletati[momentoKey]?.[nomeIncarico];
                const incaricoInfo = incarichiDisponibili.find((i) => i.nome === nomeIncarico);

                return (
                  <div key={nomeIncarico} style={{ marginBottom: 8 }}>
                    <div
                      onClick={() => toggleCompletato(momentoKey, nomeIncarico)}
                      style={{
                        cursor: 'pointer',
                        padding: '6px 10px',
                        borderRadius: 6,
                        backgroundColor: completato ? '#d4edda' : '#f8f9fa',
                        border: completato ? '2px solid #28a745' : '1px solid #ccc',
                        fontWeight: completato ? '700' : '400',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'space-between',
                      }}
                      title={
                        completato
                          ? 'Completato - clicca per annullare'
                          : 'Da completare - clicca per segnare come completato'
                      }
                    >
                      <span>
                        {completato ? '✔️ ' : ''} {incaricoInfo?.emoji || ''} {nomeIncarico}
                      </span>
                    </div>
                  </div>
                );
              })
            )}

            {tuttiCompletati(momentoKey) && (
              <div style={{ marginTop: 8, color: '#28a745', fontWeight: '700' }}>
                🎉 Tutti completati! +10 punti! 🎊
              </div>
            )}
          </div>
        );
      })}

      <div style={{ marginTop: 10, fontWeight: '700', fontSize: '1.1rem' }}>
        Punteggio totale: {punteggioAccumulato}
      </div>
    </div>
  );
};

export default Bambino;
