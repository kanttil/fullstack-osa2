import React from 'react'

const Kurssi = ({ kurssi }) => {
    const { nimi, osat } = kurssi

    return (
        <div>
            <Otsikko kurssi={nimi} />
            <Sisalto osat={osat} />
            <Yhteensa osat={osat} />
        </div>
    )
}

const Otsikko = ({ kurssi }) =>
    <div>
        <h1>{kurssi}</h1>
    </div>

const Sisalto = ({ osat }) =>
    <div>
        {osat.map(osa => <Osa key={osa.id} osa={osa} />)}
    </div>

const Osa = ({ osa }) =>
    <div>
        <p>{osa.nimi} {osa.tehtavia}</p>
    </div>

const Yhteensa = ({ osat }) => {
    const yhteensa = osat.reduce((summa, osa) => summa + osa.tehtavia, 0)

    return (
        <div>
            <p>yhteensä {yhteensa} tehtävää</p>
        </div>
    )
}

export default Kurssi