import React from "react";
import { useState, useEffect } from "react";
import ReactMapGL, { Marker, Popup } from "react-map-gl";
import {Room} from "@material-ui/icons";
import "./app.css";
import NavBar from "./components/NavBar";
import axios from "axios";
import Button from "@material-ui/core/Button";
import TextField from "@mui/material/TextField";
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";

function App() {
  const [sctr,setSctr] = useState("all");
  const myStorage = window.localStorage;
  const [currentUser, setCurrentUser] = useState(myStorage.getItem("user"));
  const [currentPlaceId, setCurrentPlaceId] = useState(null);
  const [listings, setListings] = useState([]);
  const [name, setName] = useState("");
  const [adress, setAdress] = useState("");
  const [latitude, setLatitude] = useState("");
  const [longitude, setLongitude] = useState("");
  const [description, setDescription] = useState("");
  const [image, setImage] = useState("");
  const [sector, setSector] = useState("");
  const [viewport, setViewport] = useState({
    width: "100vw",
    height: "100vh",
    latitude: 35.8245,
    longitude: 10.6346,
    zoom: 10,
  });
  const [loading, setLoading] = useState(true);
  const uploadImage = async (e) => {
    const file = e.target.files[0];
    const base64 = await convertBase64(file);
    console.log(base64);
  };
  const convertBase64 = (file) => {
    return new Promise((resolve, reject) => {
      const fileReader = new FileReader();
      fileReader.readAsDataURL(file);

      fileReader.onload = () => {
        resolve(fileReader.result);
      };
      fileReader.onerror = (error) => {
        reject(error);
      };
    });
  };

  useEffect(() => {
    const getListings = async () => {
      try {
        const res = await axios.get("/listings");
        console.log(res.data);
        setListings(res.data);
        setLoading(false);
      } catch (err) {
        console.log(err);
      }
    };
    getListings();
  }, []);

  const deleteListing = async (id) => {
    await axios.delete("http://localhost:5000/listings/"+id).then (()=> window.location.reload())
  };
  const onSubmit = async (id, updates)=>{
    axios.patch("http://localhost:5000/listings/"+id,updates).then (()=> window.location.reload())
  };
  const handleMarkerClick = (id) =>{
setCurrentPlaceId(id);
  }
  const [open, setOpen] = React.useState(false);

  const handleClickOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };
  return (
    <div className="App">
      <NavBar myStorage={myStorage} currentUser={currentUser} setCurrentUser={setCurrentUser} setSctr={setSctr}/>
      {!loading &&
      <ReactMapGL
        {...viewport}
        mapboxApiAccessToken={
          "pk.eyJ1IjoidGF5c3NpciIsImEiOiJja3VvZnh4MWowaTc0MzBqdHhjYnlma2l1In0.a1worRZg5_2rVgaZlTRsVw"
        }
        onViewportChange={(nextViewport) => setViewport(nextViewport)}
        mapStyle="mapbox://styles/tayssir/ckup7rrwd7j5f17q199s6vjwo"
      >
        {listings.map(L => (
          
          <div  key={L._id}>
            {sctr === 'all' ? (<div><Marker
              latitude={parseFloat(L.latitude)}
              longitude={parseFloat(L.longitude)}
              offsetLeft={-20}
              offsetTop={-10}
              key={L._id+1}
            >
              <Room style={{ fontSize: viewport.zoom * 5, color: "red", cursor:'pointer' }}
                    key={L._id+2}
                    onClick={()=> handleMarkerClick(L._id)} />
            </Marker></div>) : sctr ==='private'&& L.sector==='private' ? (
              
              <div><Marker
              latitude={parseFloat(L.latitude)}
              longitude={parseFloat(L.longitude)}
              offsetLeft={-20}
              offsetTop={-10}
              key={L._id+1}
            >
              <Room style={{ fontSize: viewport.zoom * 5, color: "red", cursor:'pointer' }}
                    key={L._id+2}
                    onClick={()=> handleMarkerClick(L._id)} />
            </Marker></div>
            ): sctr ==='public'&& L.sector==='public' ?(<div><Marker
              latitude={parseFloat(L.latitude)}
              longitude={parseFloat(L.longitude)}
              offsetLeft={-20}
              offsetTop={-10}
              key={L._id+1}
            >
              <Room style={{ fontSize: viewport.zoom * 5, color: "red", cursor:'pointer' }}
                    key={L._id+2}
                    onClick={()=> handleMarkerClick(L._id)} />
            </Marker></div>) : (<div></div>)}
            {L._id === currentPlaceId &&
            <Popup
              latitude={parseFloat(L.latitude)}
              longitude={parseFloat(L.longitude)}
              closeButton={true}
              closeOnClick={false}
              anchor="left"
              key={L._id+3}
              onClose={()=> setCurrentPlaceId(null)}
            >
              <div className="details-container"  key={L._id+4}>
                <label>name</label>
                <h4>{L.name}</h4>
                <label>adress</label>
                <p>{L.adress}</p>
                <label>latitude / longitude</label>
                <p>
                  {L.latitude} / {L.longitude}
                </p>
                <label>description</label>
                <p>{L.description}</p>
                <label>image</label>
                <img src ={L.img} height="100px" />
                <label>sector</label>
                <h4>{L.sector}</h4>
              </div>
              {currentUser ?
              (<div>
                <Button onClick={handleClickOpen}>EDIT</Button>
                <Dialog open={open} onClose={handleClose}>
                <DialogContent>
                  <TextField
                    autoFocus
                    margin="dense"
                    id="name"
                    label="name"
                    type="text"
                    fullWidth
                    variant="standard"
                    onChange={(e) => setName(e.target.value)}
                  />
                  <TextField
                    margin="dense"
                    id="adress"
                    label="adress"
                    type="text"
                    fullWidth
                    variant="standard"
                    onChange={(e) => setAdress(e.target.value)}
                  />{" "}
                  <TextField
                    margin="dense"
                    id="latitude"
                    label="latitude"
                    type="text"
                    fullWidth
                    variant="standard"
                    onChange={(e) => setLatitude(e.target.value)}
                  />
                  <TextField
                    margin="dense"
                    id="longitude"
                    label="longitude"
                    type="text"
                    fullWidth
                    variant="standard"
                    onChange={(e) => setLongitude(e.target.value)}
                  />
                  <TextField
                    margin="dense"
                    id="description"
                    label="description"
                    type="text"
                    fullWidth
                    variant="standard"
                    onChange={(e) => setDescription(e.target.value)}
                  />
                  <TextField
                    margin="dense"
                    id="image"
                    label="image"
                    type="file"
                    fullWidth
                    variant="standard"
                    onInput={(e) => {
                      uploadImage(e);
                    }}
                    onChange={(e) => setImage(e.target.value)}
                  />
                  <TextField
                    margin="dense"
                    id="sector"
                    label="sector"
                    type="text"
                    fullWidth
                    variant="standard"
                    onChange={(e) => setSector(e.target.value)}
                  />
                </DialogContent>
                <DialogActions>
                  <Button onClick={handleClose}>Cancel</Button>
                  <Button onClick={()=>onSubmit(L._id,{name,adress,latitude, longitude, description,image , sector})}>Edit Listing</Button>
                </DialogActions>
              </Dialog>
                <Button onClick={()=> deleteListing(L._id)}>DELETE</Button>
              </div>) : (<div> </div>)}
            </Popup>}
          </div>
        ))}
      </ReactMapGL>}
    </div>
  );
}

export default App;
