import React from 'react';

export default function MomentoGiorno({ bambinoId, momento, incarichiCompletati, aggiornaIncarichi, incarichiSelezionati }) {
  // incarichiSelezionati è un array di oggetti incarico {id, label, emoji} scelti dai genitori per questo momento

  // Funzione per toggle incarico completato
  function toggleIncarico(id) {
    const nuovoStato = { ...incarichiCompletati };
    nuovoStato[id] = !nuovoStato[id];
    aggiornaIncarichi(nuovoStato);
  }

  return (
    <div style={{ marginBottom: 15 }}>
      <h4>{momento.charAt(0).toUpperCase() + momento.slice(1)}</h4>
      <ul style={{ listStyle: 'none', paddingLeft: 0 }}>
        {incarichiSelezionati.length === 0 && <li style={{ fontStyle: 'italic', color: '#888' }}>Nessun incarico assegnato</li>}
        {incarichiSelezionati.map(({ id, label, emoji }) => (
          <li
            key={id}
            onClick={() => toggleIncarico(id)}
            style={{
              cursor: 'pointer',
              padding: '4px 8px',
              marginBottom: 4,
              borderRadius: 4,
              backgroundColor: incarichiCompletati[id] ? '#a6e3a1' : '#eee',
              userSelect: 'none'
            }}
            title={label}
          >
            <span style={{ marginRight: 8 }}>{emoji}</span>
            {label}
          </li>
        ))}
      </ul>
    </div>
  );
}
