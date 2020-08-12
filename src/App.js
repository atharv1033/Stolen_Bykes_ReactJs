import React, { useState, useEffect, useRef } from 'react';
//import { UseStyles } from './Style.js';
import { DateRange, Refresh } from '@material-ui/icons'
import { createUseStyles } from 'react-jss';
import Loader from 'react-loader-spinner';

var incidents = [];

export const UseStyles = createUseStyles({
  container: {
    width: 1050,
    margin: {
      top: 40,
      left: 200,
    }
  },

  bigHeader: {
    fontSize: 45,
    marginBottom: 0
  },

  smallHeader: {
    fontSize: 25,
    marginTop: 5
  },

  inputContainer: {
    fontSize: 30,
    margin: {
      top: 50,
      bottom: 40
    }
  },

  searchInput: {
    marginRight: 15,
    width: 400
  },

  dateIcon: {
    fontSize: 35,
    marginLeft: 5,
    verticalAlign: "middle"
  },

  otherInput: {
    marginLeft: 25
  },

  totalIncidents: {
    textAlign: 'right',
  },

  incidentList: {
    height: 400,
    overflowY: 'scroll',
    marginTop: 50
  },

  incidentItem: {
    marginBottom: 20,
    padding: 20,
    border: [
      [1, 'solid', 'black']
    ]
  },
});

export default function App() {

  const [search, setSearch] = useState('');
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [totalIncidents, setTotalIncidents] = useState(0);
  const [incidentsList, setIncidentsList] = useState([]);
  const [pageNum, setPageNum] = useState(1);
  const endRef = useRef(null);
  const styles = UseStyles();

  function getIncidentDetails() {
    console.log('details');
  }

  function getCases() {
    setIncidentsList(
      <center>
        <Loader type="ThreeDots" color="blue" height="100" width="100" />
      </center>
    );

    var apiUrl = "https://bikewise.org:443/api/v2/incidents?proximity=berlin";

    if (endDate !== "") {
      let d = Date.parse(endDate);
      d = Math.floor(d / 1000);
      d = d.toString();
      console.log(d);
      apiUrl = apiUrl + "&occured_before=" + d;
    }
    if (startDate !== "") {
      let d = Date.parse(startDate);
      d = Math.floor(d / 1000);
      d = d.toString();
      console.log(d);
      apiUrl = apiUrl + "&occured_after=" + d;
    }
    if (search !== '') {
      apiUrl = apiUrl + "&query=" + search;
    }

    fetch(apiUrl)
      .then(res => res.json())
      .then(
        (result) => {
          setTotalIncidents(result.incidents.length);
          if (result.incidents.length < 1) {
            setIncidentsList(
              <p> No cases found </p>
            );
            return;
          }

          let array = [];
          incidents = result.incidents;
          console.log(incidents);
          for (var i = 0; i < 10; i++) {
            if (typeof incidents[i] !== "undefined") {
              array.push(
                <div key={i} className={styles.incidentItem}>
                  <a href="#" onClick={getIncidentDetails} className={styles.incidentTitle} >{incidents[i].title}</a>
                  <p>{incidents[i].description}</p>
                  <p>{incidents[i].address}</p>
                </div>
              );
            }
          }
          setIncidentsList(array);
        },
        (error) => {
          setIncidentsList(
            <p> Error getting cases </p>
          );
          console.log(error);
        });
  }

  function goNext() {
    let j = pageNum * 10;
    if (j >= totalIncidents) {
      return;
    }
    setPageNum(pageNum + 1);

    let array = [];
    for (var i = j; i < j + 10; i++) {
      if (typeof incidents[i] !== "undefined") {
        array.push(
          <div key={i} className={styles.incidentItem}>
            <a href="#" onClick={getIncidentDetails} className={styles.incidentTitle} >{incidents[i].title}</a>
            <p>{incidents[i].description}</p>
            <p>{incidents[i].address}</p>
          </div>
        );
      }
    }
    setIncidentsList(array);

  }

  function goPrev() {
    if (pageNum === 1) {
      return;
    }

    let j = (pageNum - 2) * 10;
    setPageNum(pageNum - 1);

    let array = [];
    for (var i = j; i < j + 10; i++) {
      if (typeof incidents[i] !== "undefined") {
        array.push(
          <div key={i} className={styles.incidentItem}>
            <a href="#" onClick={getIncidentDetails} className={styles.incidentTitle} >{incidents[i].title}</a>
            <p>{incidents[i].description}</p>
            <p>{incidents[i].address}</p>
          </div>
        );
      }
    }
    setIncidentsList(array);
    endRef.current.scrollIntoView({ behavior: "smooth" });
  }

  function refresh() {
    setSearch('');
    setStartDate('');
    setEndDate('');
    setTimeout(getCases, 500);
  }

  useEffect(() => {
    getCases();
  }, []);


  return (
    <div className={styles.container}>
      <p className={styles.bigHeader} >Police Department of Berlin</p>
      <p className={styles.smallHeader} >Stolen Bykes</p>

      <div className={styles.inputContainer} >
        <input className={styles.searchInput} placeholder="Search case descriptions" value={search} onChange={e => setSearch(e.target.value)} />

        <input className={styles.otherInput} type="date" placeholder="from" value={startDate} onChange={e => setStartDate(e.target.value)} />
        <DateRange fontSize={'inherit'} className={styles.dateIcon} />

        <input className={styles.otherInput} type="date" placeholder="to" value={endDate} onChange={e => setEndDate(e.target.value)} />
        <DateRange fontSize={'inherit'} className={styles.dateIcon} />

        <button className={styles.otherInput} onClick={getCases} >find cases</button>
        <button className={styles.otherInput} onClick={refresh}>
          <Refresh fontSize={'inherit'} className={styles.dateIcon} />
        </button>
      </div>
      <div>
        <p className={styles.totalIncidents} > Total Incidents: {totalIncidents}</p>
      </div>
      <div className={styles.incidentList}>
        {incidentsList}
      </div>
      <div style={{ marginLeft: 800, marginBottom: 50, marginTop: 50 }}>
        <button style={{ marginRight: 20 }} disabled={(pageNum === 1) ? true : false} onClick={goPrev} >prev</button>
        <p style={{ display: "inline" }} >{pageNum}</p>
        <button style={{ marginLeft: 20 }} disabled={((pageNum * 10) >= totalIncidents) ? true : false} onClick={goNext}>next</button>
      </div>

      <div ref={endRef} />
    </div>
  );
}
