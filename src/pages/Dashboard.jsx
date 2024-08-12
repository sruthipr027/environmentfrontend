import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import { Card, Button, Container, Row, Col, Modal, Tabs, Tab } from 'react-bootstrap';
import { Line } from 'react-chartjs-2';
import {
    Chart as ChartJS,
    CategoryScale,
    LinearScale,
    PointElement,
    LineElement,
    Title,
    Tooltip,
    Legend
} from 'chart.js';


ChartJS.register(
    CategoryScale,
    LinearScale,
    PointElement,
    LineElement,
    Title,
    Tooltip,
    Legend
);

function Dashboard() {
    const [username, setUserName] = useState('');
    const [sensorData, setSensorData] = useState([]);
    const [show, setShow] = useState(false);
    const [modalTitle, setModalTitle] = useState('');
    const [lineChartData, setLineChartData] = useState({ labels: [], datasets: [] });
    const [activeTab, setActiveTab] = useState('daily'); // Track the active tab

    useEffect(() => {
        if (typeof window !== 'undefined') {
            const user = JSON.parse(sessionStorage.getItem("existingUser"));
            if (user && user.username) {
                setUserName(user.username);
            }
        }
        fetchSensorData();
    }, []);

    const fetchSensorData = async () => {
        try {
            const response = await axios.get('http://localhost:4000/data/getsensorreport/:columnname/:timeframe'); 
            setSensorData(response.data);
        } catch (error) {
            console.error('Error fetching sensor data:', error);
        }
    };

    const fetchData = async (modalTitle, timeframe) => {
        try {
            const response = await axios.get(`http://localhost:4000/data/getsensorreport/${modalTitle}/${timeframe}`);
            const values = response.data.map(item => item[modalTitle]);
            const labels = response.data.map(item => {
                const date = new Date(item.timestamp);
                return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
            });
            return { labels, data: values };
        } catch (error) {
            console.error('Error fetching data:', error);
        }
    };

    const handleClose = () => {
        setShow(false);
    };

    const handleShow = async (event) => {
        const dataId = event.target.getAttribute('data-id');
        setModalTitle(dataId);
        const { labels, data } = await fetchData(dataId, activeTab); 
        setLineChartData({
            labels: labels,
            datasets: [
                {
                    label: `${modalTitle} Level`,
                    data: data,
                    borderColor: 'rgba(75, 192, 192, 1)',
                    backgroundColor: 'rgba(75, 192, 192, 0.2)',
                    fill: true,
                }
            ]
        });
        setShow(true);
    };

    const handleTabSelect = async (key) => {
        setActiveTab(key); 
        const { labels, data } = await fetchData(modalTitle, key);
        setLineChartData({
            labels: labels,
            datasets: [
                {
                    
                    data: data,
                    borderColor: 'rgba(75, 192, 192, 1)',
                    backgroundColor: 'rgba(75, 192, 192, 0.2)',
                    fill: true,
                }
            ]
        });
    };

    return (
        <div className='d-flex back'>
            <aside className='d-flex justify-content-center align-items-center flex-column w-25'>
                <h3 className='head-name text-dark mt-5'>
                    <i className="fi fi-sr-briefcase" style={{ color: 'springgreen' }}></i>
                    Welcome <span className='text-light'>{username}</span>
                </h3>
                <div className='profile d-flex justify-content-center align-items-center flex-column'>
                    <img className='rounded-circle mt-5' src="https://as2.ftcdn.net/v2/jpg/05/32/02/01/1000_F_532020119_6XdexlB5QqZxK8BND7Z5iikJsD6dtM26.jpg" alt="" width={'100px'} height={'100px'} />
                    <button style={{marginTop:'20px'}} className='btn btn-light' ><Link style={{textDecoration:'none', color:'black'}} to={'/register'}>Log out</Link></button>
                </div>
            </aside>
            <div className='bg-dark main d-flex text-light justify-content-center p-5'>
                <Container fluid className="mt-5">
                    <h1 className="text-center mb-4" ><i style={{color:'white'}}>Environmental Data Dashboard</i></h1>
                    <Row>
                        <Col xs={12} sm={6} md={4} lg={3} className="mb-4 me-5">
                            <Card className='cards'>
                                <Card.Header className='bg-success text-center'>Sensor Data</Card.Header>
                                <Card.Body>
                                    <Card.Title className='text-center'>pH values</Card.Title>
                                    <Button className='viewgrpah bg-success ms-2 border border-none' data-id='ph' variant="primary" onClick={handleShow}>View Graph</Button>
                                </Card.Body>
                            </Card>
                        </Col>
                        <Col xs={12} sm={6} md={4} lg={3} className="mb-4 me-5 ">
                            <Card>
                                <Card.Header className='bg-success text-center'>Sensor Data</Card.Header>
                                <Card.Body>
                                    <Card.Title className='text-center'>TSS values</Card.Title>
                                    <Button className='viewgrpah bg-success ms-2 border border-none' data-id='tss' variant="primary" onClick={handleShow}>View Graph</Button>
                                </Card.Body>
                            </Card>
                        </Col>
                        <Col xs={12} sm={6} md={4} lg={3} className="mb-4  me-5">
                            <Card>
                                <Card.Header className='bg-success text-center'>Sensor Data</Card.Header>
                                <Card.Body>
                                    <Card.Title className='text-center'>TDS values</Card.Title>
                                    <Button className='viewgrpah bg-success ms-2 border border-none' data-id='tds' variant="primary" onClick={handleShow}>View Graph</Button>
                                </Card.Body>
                            </Card>
                        </Col>
                        <Col xs={12} sm={6} md={4} lg={3} className="mb-4  me-5">
                            <Card>
                                <Card.Header className='bg-success text-center'>Sensor Data</Card.Header>
                                <Card.Body>
                                    <Card.Title className='text-center'>BOD values</Card.Title>
                                    <Button className='viewgrpah bg-success ms-2 border border-none'data-id='bod' variant="primary" onClick={handleShow}>View Graph</Button>
                                </Card.Body>
                            </Card>
                        </Col>
                        <Col xs={12} sm={6} md={4} lg={3} className="mb-4  me-5">
                            <Card>
                                <Card.Header className='bg-success text-center'>Sensor Data</Card.Header>
                                <Card.Body>
                                    <Card.Title className='text-center'>COD values</Card.Title>
                                    <Button className='viewgrpah bg-success ms-2 border border-none' data-id='cod' variant="primary" onClick={handleShow}>View Graph</Button>
                                </Card.Body>
                            </Card>
                        </Col>
                        <Col xs={12} sm={6} md={4} lg={3} className="mb-4  me-5">
                            <Card>
                                <Card.Header className='bg-success text-center'>Sensor Data</Card.Header>
                                <Card.Body>
                                    <Card.Title className='text-center'>Chloride </Card.Title>
                                    <Button className='viewgrpah bg-success ms-2 border border-none' data-id='chloride' variant="primary" onClick={handleShow}>View Graph</Button>
                                </Card.Body>
                            </Card>
                        </Col>
                    </Row>
                </Container>
                <Modal show={show} onHide={handleClose}>
                    <Modal.Header closeButton>
                        <Modal.Title>{modalTitle}</Modal.Title>
                    </Modal.Header>
                    <Modal.Body>
                        <Tabs activeKey={activeTab} onSelect={handleTabSelect} id="sensor-data-tabs">
                            <Tab eventKey="daily" title="Daily">
                                <div id='dailygraph'>
                                    <Line data={lineChartData} />
                                </div>
                            </Tab>
                            <Tab eventKey="weekly" title="Weekly">
                                <div id='weeklygraph'>
                                    <Line data={lineChartData} />
                                </div>
                            </Tab>
                            <Tab eventKey="monthly" title="Monthly">
                                <div id='monthlygraph'>
                                    <Line data={lineChartData} />
                                </div>
                            </Tab>
                            <Tab eventKey="yearly" title="Yearly">
                                <div id='yearlygraph'>
                                    <Line data={lineChartData} />
                                </div>
                            </Tab>
                        </Tabs>
                    </Modal.Body>
                </Modal>
            </div>
        </div>
    );
}

export default Dashboard;
