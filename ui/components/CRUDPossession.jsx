import React from 'react';
import { useNavigate, useParams, Link } from 'react-router-dom';
import axios from 'axios';

// Liste des possessions
const ListPossession = () => {
    const [possessions, setPossessions] = React.useState([]);
    const [error, setError] = React.useState(null);
    const navigate = useNavigate();

    React.useEffect(() => {
        const fetchPossessions = async () => {
            try {
                const response = await axios.get('http://localhost:3000/api/possessions');
                setPossessions(response.data);
            } catch (error) {
                setError('Une erreur est survenue lors de la récupération des possessions.');
            }
        };

        fetchPossessions();
    }, []);

    const handleClose = async (libelle) => {
        try {
            await axios.post(`http://localhost:3000/api/possessions/${libelle}/close`);
            setPossessions(prevPossessions => prevPossessions.filter(p => p.libelle !== libelle));
        } catch (error) {
            setError('Une erreur est survenue lors de la clôture de la possession.');
        }
    };

    return (
        <div>
            <h1>Liste des Possessions</h1>
            {error && <div className="alert alert-danger">{error}</div>}
            <Link className="btn btn-primary" to="/possessions/create">Créer une nouvelle possession</Link>
            <table className="table mt-3">
                <thead>
                    <tr>
                        <th>Libelle</th>
                        <th>Valeur</th>
                        <th>Date Début</th>
                        <th>Date Fin</th>
                        <th>Taux</th>
                        <th>Valeur Actuelle</th>
                        <th>Action</th>
                    </tr>
                </thead>
                <tbody>
                    {possessions.length > 0 ? (
                        possessions.map((possession) => (
                            <tr key={possession.libelle}>
                                <td>{possession.libelle}</td>
                                <td>{possession.valeur}</td>
                                <td>{possession.dateDebut}</td>
                                <td>{possession.dateFin || 'En cours'}</td>
                                <td>{possession.taux}%</td>
                                <td>{(possession.valeur * (1 + possession.taux / 100)).toFixed(2)}</td>
                                <td>
                                    <Link className="btn btn-warning btn-sm" to={`/possessions/${possession.libelle}/update`}>Éditer</Link>
                                    <button 
                                        className="btn btn-danger btn-sm ms-2"
                                        onClick={() => handleClose(possession.libelle)}
                                        disabled={possession.dateFin}
                                    >
                                        Clôturer
                                    </button>
                                </td>
                            </tr>
                        ))
                    ) : (
                        <tr>
                            <td colSpan="7">Aucune possession disponible</td>
                        </tr>
                    )}
                </tbody>
            </table>
        </div>
    );
};

// Création de possession
const CreatePossession = () => {
    const [libelle, setLibelle] = React.useState('');
    const [valeur, setValeur] = React.useState('');
    const [dateDebut, setDateDebut] = React.useState('');
    const [dateFin, setDateFin] = React.useState('');
    const [taux, setTaux] = React.useState('');
    const [error, setError] = React.useState(null);
    const navigate = useNavigate();

    const handleSubmit = async (event) => {
        event.preventDefault();

        try {
            const response = await axios.post('http://localhost:3000/api/possessions', {
                libelle,
                valeur,
                dateDebut,
                dateFin,
                taux,
            });

            if (response.status === 201) {
                navigate('/possessions');
            }
        } catch (error) {
            setError('Une erreur est survenue lors de la création de la possession.');
        }
    };

    return (
        <div className="container mt-5">
            <h2>Créer une Nouvelle Possession</h2>
            {error && <div className="alert alert-danger">{error}</div>}
            <form onSubmit={handleSubmit}>
                <div className="form-group">
                    <label htmlFor="libelle">Libelle</label>
                    <input
                        type="text"
                        className="form-control"
                        id="libelle"
                        value={libelle}
                        onChange={(e) => setLibelle(e.target.value)}
                        required
                    />
                </div>
                <div className="form-group">
                    <label htmlFor="valeur">Valeur</label>
                    <input
                        type="number"
                        className="form-control"
                        id="valeur"
                        value={valeur}
                        onChange={(e) => setValeur(e.target.value)}
                        required
                    />
                </div>
                <div className="form-group">
                    <label htmlFor="dateDebut">Date Début</label>
                    <input
                        type="date"
                        className="form-control"
                        id="dateDebut"
                        value={dateDebut}
                        onChange={(e) => setDateDebut(e.target.value)}
                        required
                    />
                </div>
                <div className="form-group">
                    <label htmlFor="dateFin">Date Fin</label>
                    <input
                        type="date"
                        className="form-control"
                        id="dateFin"
                        value={dateFin}
                        onChange={(e) => setDateFin(e.target.value)}
                    />
                </div>
                <div className="form-group">
                    <label htmlFor="taux">Taux d'Amortissement (%)</label>
                    <input
                        type="number"
                        className="form-control"
                        id="taux"
                        value={taux}
                        onChange={(e) => setTaux(e.target.value)}
                    />
                </div>
                <button type="submit" className="btn btn-primary mt-3">
                    Créer
                </button>
            </form>
        </div>
    );
};

// Mise à jour de possession
const UpdatePossession = () => {
    const { libelle } = useParams();
    const [possession, setPossession] = React.useState({
        libelle: '',
        valeur: '',
        dateDebut: '',
        dateFin: '',
        taux: ''
    });
    const [error, setError] = React.useState(null);
    const navigate = useNavigate();

    React.useEffect(() => {
        const fetchPossession = async () => {
            try {
                const response = await axios.get(`http://localhost:3000/api/possessions/${libelle}`);
                setPossession(response.data);
            } catch (error) {
                setError('Erreur lors de la récupération des détails de la possession.');
            }
        };

        fetchPossession();
    }, [libelle]);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setPossession(prevState => ({
            ...prevState,
            [name]: value
        }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        try {
            await axios.put(`http://localhost:3000/api/possessions/${libelle}`, possession);
            alert('Possession mise à jour avec succès');
            navigate('/possessions');
        } catch (error) {
            setError('Erreur lors de la mise à jour de la possession.');
        }
    };

    return (
        <div className="container mt-5">
            <h1>Mettre à jour la possession</h1>
            {error && <div className="alert alert-danger">{error}</div>}
            <form onSubmit={handleSubmit}>
                <div className="form-group">
                    <label>Libelle</label>
                    <input
                        type="text"
                        className="form-control"
                        name="libelle"
                        value={possession.libelle}
                        onChange={handleChange}
                        disabled
                    />
                </div>
                <div className="form-group">
                    <label>Valeur</label>
                    <input
                        type="number"
                        className="form-control"
                        name="valeur"
                        value={possession.valeur}
                        onChange={handleChange}
                        required
                    />
                </div>
                <div className="form-group">
                    <label>Date Début</label>
                    <input
                        type="date"
                        className="form-control"
                        name="dateDebut"
                        value={possession.dateDebut}
                        onChange={handleChange}
                        required
                    />
                </div>
                <div className="form-group">
                    <label>Date Fin</label>
                    <input
                        type="date"
                        className="form-control"
                        name="dateFin"
                        value={possession.dateFin}
                        onChange={handleChange}
                    />
                </div>
                <div className="form-group">
                    <label>Taux d'Amortissement (%)</label>
                    <input
                        type="number"
                        className="form-control"
                        name="taux"
                        value={possession.taux}
                        onChange={handleChange}
                    />
                </div>
                <button type="submit" className="btn btn-primary mt-3">Mettre à jour</button>
            </form>
        </div>
    );
};

export { ListPossession, CreatePossession, UpdatePossession };
