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
    const [sensorData, setSensorData] = useState({
        ph: null,
        tss: null,
        tds: null,
        bod: null,
        cod: null,
        chloride: null,
    });
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
            const response = await axios.get(`http://localhost:4000/data/getsensordata`);
            const data = response.data;
           
            const latestData = data[data.length - 1]; 
            setSensorData({
                ph: latestData.ph,
                tss: latestData.tss,
                tds: latestData.tds,
                bod: latestData.bod,
                cod: latestData.cod,
                chloride: latestData.chloride,
            });
            console.log("Latest sensor data set:", latestData);
        } catch (error) {
            console.error('Error fetching sensor data:', error);
        }
    };

    // Fetch and process data for charting purposes
    const fetchData = async (modalTitle, timestamp) => {
        try {
            const response = await axios.get(`http://localhost:4000/data/getsensorreport/${modalTitle}/${timestamp}`);
            const rawData = response.data;

            let averageData;
            switch (timestamp) {
                case 'daily':
                    averageData = calculateDailyAverage(rawData, modalTitle);
                    break;
                case 'weekly':
                    averageData = calculateWeeklyAverage(rawData, modalTitle); // Implement this
                    break;
                case 'monthly':
                    averageData = calculateMonthlyAverage(rawData, modalTitle); // Implement this
                    break;
                case 'yearly':
                    averageData = calculateYearlyAverage(rawData, modalTitle); // Implement this
                    break;
                default:
                    averageData = {}; // Fallback
            }

            const labels = Object.keys(averageData); 
            console.log(labels); // E.g., "00:00", "01:00", etc. for daily
            const data = Object.values(averageData);
            console.log(data);

            return { labels, data };
        } catch (error) {
            console.error('Error fetching data:', error);
        }
    };
    const calculateDailyAverage = (data, key) => {
        const phByHour = {};
    
        // Group data by hour
        data.forEach(entry => {
            const date = new Date(entry.timestamp);
            const hour = date.getHours();  // Using local hours
    
            if (!phByHour[hour]) {
                phByHour[hour] = [];
            }
            phByHour[hour].push(entry[key]);  // key is like 'pH', 'TSS', etc.
        });
    
        // Calculate average pH by hour
        const averagePhByHour = {};
    
        for (const hour in phByHour) {
            const sum = phByHour[hour].reduce((acc, value) => acc + value, 0);
            const average = sum / phByHour[hour].length;
            averagePhByHour[`${hour}:00`] = average.toFixed(2); // Rounded to 2 decimal places
        }
    
        return averagePhByHour;
    };
    
    // Example usage:
    const calculateWeeklyAverage = (data, key) => {
        const phByDay = {};
    
        data.forEach(entry => {
            const date = new Date(entry.timestamp);
            const day = date.getDay();  // 0 (Sunday) to 6 (Saturday)
    
            if (!phByDay[day]) {
                phByDay[day] = [];
            }
            phByDay[day].push(entry[key]);
        });
    
        const averagePhByDay = {};
        for (const day in phByDay) {
            const sum = phByDay[day].reduce((acc, value) => acc + value, 0);
            const average = sum / phByDay[day].length;
            averagePhByDay[`Day ${day}`] = average.toFixed(2); 
        }
    
        return averagePhByDay;
    };
    const calculateMonthlyAverage = (data, key) => {
        const valuesByDay = {};
    
        // Group data by day of the month
        data.forEach(entry => {
            const date = new Date(entry.timestamp);
            const day = date.getDate();  // Day of the month (1-31)
    
            if (!valuesByDay[day]) {
                valuesByDay[day] = [];
            }
            valuesByDay[day].push(entry[key]);
        });
    
        // Calculate average by day
        const averageByDay = {};
    
        for (const day in valuesByDay) {
            const sum = valuesByDay[day].reduce((acc, value) => acc + value, 0);
            const average = sum / valuesByDay[day].length;
            averageByDay[`${day}`] = average.toFixed(2); // Use the day as the label
        }
    
        return averageByDay;
    };
    const calculateYearlyAverage = (data, key) => {
        const valuesByMonth = {};
    
        // Group data by month
        data.forEach(entry => {
            const date = new Date(entry.timestamp);
            const month = date.getMonth();  // Month (0-11)
    
            if (!valuesByMonth[month]) {
                valuesByMonth[month] = [];
            }
            valuesByMonth[month].push(entry[key]);
        });
    
        // Calculate average by month
        const averageByMonth = {};
    
        for (const month in valuesByMonth) {
            const sum = valuesByMonth[month].reduce((acc, value) => acc + value, 0);
            const average = sum / valuesByMonth[month].length;
            averageByMonth[new Date(0, month).toLocaleString('default', { month: 'long' })] = average.toFixed(2); // Month name as label
        }
    
        return averageByMonth;
    };
    

    const handleClose = () => {
        setShow(false);
    };

    const handleShow = async (event) => {
        const dataId = event.target.getAttribute('data-id');
        setModalTitle(dataId); // Set the title first
        const { labels, data } = await fetchData(dataId, activeTab); // Then fetch data using the set title
        setLineChartData({
            labels: labels,
            datasets: [
                {
                    label: `${dataId} Level`,
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
        console.log('Active Tab:', activeTab);
        const { labels, data } = await fetchData(modalTitle, key);
        setLineChartData({
            labels: labels,
            datasets: [
                {
                    label: `${modalTitle} Level (${key})`,
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
                                    <Card.Title className='text-center'>
                                        pH values
                                        {sensorData.ph !== null && (
                                            <div>Latest: {sensorData.ph}</div>
                                        )}
                                    </Card.Title>
                                    <Button className='viewgrpah bg-success ms-2 border border-none' data-id='ph' variant="primary" onClick={handleShow}>View Graph</Button>
                                </Card.Body>
                            </Card>
                        </Col>
                        <Col xs={12} sm={6} md={4} lg={3} className="mb-4 me-5 ">
                            <Card>
                                <Card.Header className='bg-success text-center'>Sensor Data</Card.Header>
                                <Card.Body>
                                    <Card.Title className='text-center'>
                                        TSS values
                                        {sensorData.tss !== null && (
                                            <div>Latest: {sensorData.tss}</div>
                                        )}
                                    </Card.Title>
                                    <Button className='viewgrpah bg-success ms-2 border border-none' data-id='tss' variant="primary" onClick={handleShow}>View Graph</Button>
                                </Card.Body>
                            </Card>
                        </Col>
                        <Col xs={12} sm={6} md={4} lg={3} className="mb-4  me-5">
                            <Card>
                                <Card.Header className='bg-success text-center'>Sensor Data</Card.Header>
                                <Card.Body>
                                    <Card.Title className='text-center'>
                                        TDS values
                                        {sensorData.tds !== null && (
                                            <div>Latest: {sensorData.tds}</div>
                                        )}
                                    </Card.Title>
                                    <Button className='viewgrpah bg-success ms-2 border border-none' data-id='tds' variant="primary" onClick={handleShow}>View Graph</Button>
                                </Card.Body>
                            </Card>
                        </Col>
                        <Col xs={12} sm={6} md={4} lg={3} className="mb-4  me-5">
                            <Card>
                                <Card.Header className='bg-success text-center'>Sensor Data</Card.Header>
                                <Card.Body>
                                    <Card.Title className='text-center'>
                                        BOD values
                                        {sensorData.bod !== null && (
                                            <div>Latest: {sensorData.bod}</div>
                                        )}
                                    </Card.Title>
                                    <Button className='viewgrpah bg-success ms-2 border border-none' data-id='bod' variant="primary" onClick={handleShow}>View Graph</Button>
                                </Card.Body>
                            </Card>
                        </Col>
                        <Col xs={12} sm={6} md={4} lg={3} className="mb-4  me-5">
                            <Card>
                                <Card.Header className='bg-success text-center'>Sensor Data</Card.Header>
                                <Card.Body>
                                    <Card.Title className='text-center'>
                                        COD values
                                        {sensorData.cod !== null && (
                                            <div>Latest: {sensorData.cod}</div>
                                        )}
                                    </Card.Title>
                                    <Button className='viewgrpah bg-success ms-2 border border-none' data-id='cod' variant="primary" onClick={handleShow}>View Graph</Button>
                                </Card.Body>
                            </Card>
                        </Col>
                        <Col xs={12} sm={6} md={4} lg={3} className="mb-4  me-5">
                            <Card>
                                <Card.Header className='bg-success text-center'>Sensor Data</Card.Header>
                                <Card.Body>
                                    <Card.Title className='text-center'>
                                        Chloride values
                                        {sensorData.chloride !== null && (
                                            <div>Latest: {sensorData.chloride}</div>
                                        )}
                                    </Card.Title>
                                    <Button className='viewgrpah bg-success ms-2 border border-none' data-id='chloride' variant="primary" onClick={handleShow}>View Graph</Button>
                                </Card.Body>
                            </Card>
                        </Col>
                    </Row>
                </Container>

                <Modal size="lg" show={show} onHide={handleClose} aria-labelledby="example-modal-sizes-title-lg">
                    <Modal.Header closeButton>
                        <Modal.Title>{modalTitle}</Modal.Title>
                    </Modal.Header>
                    <Modal.Body>
                        <Tabs activeKey={activeTab} onSelect={handleTabSelect}>
                            <Tab eventKey="daily" title="Daily">
                                <Line data={lineChartData} />
                            </Tab>
                            <Tab eventKey="weekly" title="Weekly">
                                <Line data={lineChartData} />
                            </Tab>
                            <Tab eventKey="monthly" title="Monthly">
                                <Line data={lineChartData} />
                            </Tab>
                            <Tab eventKey="yearly" title="Yearly">
                                <Line data={lineChartData} />
                            </Tab>
                        </Tabs>
                    </Modal.Body>
                    <Modal.Footer>
                        <Button variant="secondary" onClick={handleClose}>Close</Button>
                    </Modal.Footer>
                </Modal>
            </div>
        </div>
    );
}

export default Dashboard;
