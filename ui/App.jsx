import React, { useState, useEffect } from 'react';
import { createBrowserRouter, RouterProvider, Route, Routes, Link } from 'react-router-dom';
import './App.css';
import JSON from "../data/data.json";
import { patrimony } from '../index.js';
import { MONEY_TYPES } from './components/contants.js';
import Graphique from './components/Graphique';
import { ListPossession, CreatePossession, UpdatePossession } from './components/CRUDPossession';
import axios from 'axios';

const TITLE = ["Patrimony", "Money", "Savings Account", "Current Account"];
const FLUX = ["ENTRANT", "SORTANT"];

function Header({ data }) {
    return (
        <header className="header">
        </header>
    );
}

function Sidebar({ data }) {
    return (
        <div className="sidebar">
            <Logo />
            {TITLE.map((title, index) => (
                <div key={index} className="sidebar-card">
                    <p>{title}</p>
                    <h3>
                        <span className="currency-symbol">Ar </span>
                        {matchValueWithTitle(title, data)}
                    </h3>
                </div>
            ))}
        </div>
    );
}

function Logo() {
    return (
        <div className="logo">
        </div>
    );
}

function matchValueWithTitle(title, data) {
    if (title === "Money") return data[0]?.valeur || 0;
    else if (title === "Savings Account") {
        return sessionStorage.getItem("savingsAccount") || data[1]?.valeur || 0;
    }
    else if (title === "Current Account") return data[2]?.valeur || 0;
    else return sessionStorage.getItem("patrimoine") || 0;
}

function Table({ className, data }) {
    // Vérifie que data est défini et est un tableau avant d'appliquer filter
    const [datas] = useState(data || []);
    const biensOuFlux = datas.filter(dt => !MONEY_TYPES.includes(dt.type)).sort((data1, data2) => {
        return data1.type.localeCompare(data2.type);
    });

    return (
        <table className={className}>
            <thead>
                <tr>
                    <th>{className.includes("possessions") ? "Possessions" : "Flux"}</th>
                    <th>Valeur</th>
                    <th>Date</th>
                    <th>Type</th>
                </tr>
            </thead>
            <tbody>
                {biensOuFlux.map((bien, index) => (
                    <TableRow key={index} value={bien} />
                ))}
            </tbody>
        </table>
    );
}

function TableRow({ value }) {
    const styleIn = { color: "rgb(32, 139, 32, .7)" };
    const styleOut = { color: "rgb(177, 36, 36, 0.7)" };
    return (
        <tr>
            <td>{value.libelle}</td>
            <td>{value.valeur.toLocaleString()}</td>
            <td>{value.dateDebut.slice(0, 10)}</td>
            <td style={value.type === "ENTRANT" ? styleIn : styleOut}>{value.type}</td>
        </tr>
    );
}

function Root() {
    const [data, setData] = useState(JSON);
    const [date, setDate] = useState("");
    const [isThereError, setIsThereError] = useState(false);
    const [chartData, setChartData] = useState({
        labels: [],
        datasets: [{
            label: 'Value',
            data: [],
            borderColor: 'rgba(75, 192, 192, 1)',
            borderWidth: 1,
            fill: false
        }]
    });
    const [newPossession, setNewPossession] = useState({
        libelle: '',
        valeur: '',
        dateDebut: '',
        type: ''
    });
    const [possessions, setPossessions] = useState([]);

    const handleClick = () => {
        if (!isNaN(new Date(date).getDate())) {
            const patrimoineValue = patrimony.getPatrimoineValueAt(date).total;
            sessionStorage.setItem("patrimoine", patrimoineValue);
            sessionStorage.setItem("savingsAccount", patrimony.getPatrimoineValueAt(date).savingsAccount);
            data.push({ patrimoine: patrimoineValue, date: new Date() });

            setChartData(prevData => ({
                labels: [...prevData.labels, date],
                datasets: [{
                    ...prevData.datasets[0],
                    data: [...prevData.datasets[0].data, { x: date, y: patrimoineValue }]
                }]
            }));

            setIsThereError(false);
            setDate("");
        } else {
            setIsThereError(true);
        }
    };

    const fetchGraphData = async () => {
        try {
            const response = await axios.get('http://localhost:5000/patrimoine/2024-01-01'); // Remplace par l'URL appropriée
            const data = response.data; // Adaptation nécessaire en fonction de la réponse
            setChartData({
                labels: data.labels || [], // Assure-toi que la réponse contient les labels
                datasets: [{
                    label: 'Valeur',
                    data: data.values || [], // Assure-toi que la réponse contient les valeurs
                    borderColor: 'rgba(75, 192, 192, 1)',
                    backgroundColor: 'rgba(75, 192, 192, 0.2)',
                    fill: false,
                }]
            });
        } catch (error) {
            console.error('Erreur lors de la récupération des données graphiques:', error);
        }
    };

    const handleAddPossession = () => {
        // Ajouter une nouvelle possession
        const newPossessions = [...possessions, newPossession];
        setPossessions(newPossessions);
        setNewPossession({
            libelle: '',
            valeur: '',
            dateDebut: '',
            type: ''
        });
    };

    const handleUpdatePossession = (index, updatedPossession) => {
        // Mettre à jour une possession
        const updatedPossessions = possessions.map((poss, i) => (i === index ? updatedPossession : poss));
        setPossessions(updatedPossessions);
    };

    const handleViewPossessions = async () => {
        // Afficher la liste des possessions
        try {
            const response = await axios.get('http://localhost:3000/api/possessions'); // Remplace par l'URL appropriée
            setPossessions(response.data);
        } catch (error) {
            console.error('Erreur lors de la récupération des possessions:', error);
        }
    };

    useEffect(() => {
        fetchGraphData();
    }, []);

    return (
        <main>
            <Sidebar data={data[1]?.data?.flux || []} />
            <div className="main-content">
                <Header data={data[1]?.data?.possessions || []} />
                <nav className="nav">
                    <Link to="/flux">Flux</Link>
                    <Link to="/">Possessions</Link>
                    <Link>Date du patrimoine : {patrimony.date}</Link>
                </nav>
                <div className="date-picker-container">
                    <input 
                        id="date"
                        type="date"
                        value={date}
                        onChange={(e) => setDate(e.target.value)}
                        required
                    />
                    <button className="btn" onClick={handleClick}>Valid</button>
                    <p hidden={!isThereError} className="text-danger">Date is invalid</p>
                </div>
                <div className="possessions-container">
                    <input
                        type="text"
                        placeholder="Libelle"
                        value={newPossession.libelle}
                        onChange={(e) => setNewPossession({ ...newPossession, libelle: e.target.value })}
                    />
                    <input
                        type="number"
                        placeholder="Valeur"
                        value={newPossession.valeur}
                        onChange={(e) => setNewPossession({ ...newPossession, valeur: e.target.value })}
                    />
                    <input
                        type="date"
                        placeholder="Date de début"
                        value={newPossession.dateDebut}
                        onChange={(e) => setNewPossession({ ...newPossession, dateDebut: e.target.value })}
                    />
                    <select
                        value={newPossession.type}
                        onChange={(e) => setNewPossession({ ...newPossession, type: e.target.value })}
                    >
                        <option value="">Sélectionner le type</option>
                        <option value="ENTRANT">ENTRANT</option>
                        <option value="SORTANT">SORTANT</option>
                    </select>
                    <button className="btn" onClick={handleAddPossession}>Ajouter Possession</button>
                    <button className="btn" onClick={handleViewPossessions}>Afficher Possessions</button>
                </div>
                <Routes>
                    <Route path="/possessions" element={<ListPossession />} />
                    <Route path="/possessions/create" element={<CreatePossession />} />
                    <Route path="/possessions/:libelle/update" element={<UpdatePossession />} />
                </Routes>
                <Graphique data={chartData} />
            </div>
        </main>
    );
}

const router = createBrowserRouter([
    {
        path: "/",
        element: <Root />,
        children: [
            {
                path: "flux",
                element: <Table className="table flux" data={JSON[1]?.data?.flux || []} />
            },
            {
                path: "possessions",
                element: <ListPossession />
            },
            {
                path: "possessions/create",
                element: <CreatePossession />
            },
            {
                path: "possessions/:libelle/update",
                element: <UpdatePossession />
            }
        ]
    }
]);

function App() {
    return (
        <RouterProvider router={router} />
    );
}

export default App;
