import React from "react";
import { useState } from "react";
import { makeStyles } from "@material-ui/core/styles";
import FileBase64 from "react-file-base64";
import AppBar from "@material-ui/core/AppBar";
import ToolBar from "@material-ui/core/Toolbar";
import Typography from "@material-ui/core/Typography";
import Button from "@material-ui/core/Button";
import { PersonOutline, Add, ExitToAppOutlined } from "@material-ui/icons";
import axios from "axios";
import TextField from "@mui/material/TextField";
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import "../app.css";

const useStyles = makeStyles((theme) => ({
  root: {
    flexGrow: 1,
  },
  menuButton: {
    marginRight: theme.spacing(2),
    color: "black",
  },
  title: {
    flexGrow: 1,
    color: "black",
    fontSize: "18px",
  },
  sectors: {
    flexGrow: 1,
    color: "black",
    fontSize: "15px",
  },
  appBarTransparent: {
    backgroundColor: "rgba(67,129,168,0.8)",
  },
}));

export default function NavBar({myStorage, currentUser,setCurrentUser, setSctr}) {
  const [name, setName] = useState("");
  const [adress, setAdress] = useState("");
  const [latitude, setLatitude] = useState("");
  const [longitude, setLongitude] = useState("");
  const [description, setDescription] = useState("");
  const [image, setImage] = useState("");
  const [sector, setSector] = useState("");
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");

  const handleLogout = () => {
    myStorage.removeItem("user");
    setCurrentUser(null);
  }

  const onSubmit = (e) => {
    e.preventDefault();
    const newListing = {
      name: name,
      adress: adress,
      latitude: latitude,
      longitude: longitude,
      description: description,
      image: image,
      sector: sector,
    };
    axios
      .post("http://localhost:5000/listings", newListing)
      .then((res) => {
        window.location.reload();
      })
      .catch((err) => {
        alert("error adding Listing");
      });
  };
  const onLogin = async (e) =>{
    e.preventDefault();
    const user = {
      username: username,
      password: password,
    };
    try {const res = await axios.post("http://localhost:5000/users/login", user);
        myStorage.setItem("user", res.data.username);
        setCurrentUser(res.data.username);
        setOpen(false);
    }catch(err){
        alert("error ! check your info");
      };
  };

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
  const [open, setOpen] = React.useState(false);

  const handleClickOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };
  const classes = useStyles();

  return (
    <div className={classes.root}>
      <AppBar position="fixed" className={classes.appBarTransparent}>
        <ToolBar>
          <Typography className={classes.title}> Map App</Typography>
          <div className={classes.sectors}>
            <Button className="button" onClick={()=>setSctr("all")}>all sectors</Button>
            <Button className="button" onClick={()=>setSctr("public")}>public sector</Button>
            <Button className="button" onClick={()=>setSctr("private")}>private sector</Button>
          </div>
          {currentUser ? (
            <div>
              <div>
                <Button className="button" >
                  <ExitToAppOutlined onClick={handleLogout}/>
                  Logout
                </Button>
                <Button className="button" onClick={handleClickOpen}>
                  <Add />
                  Add Listing
                </Button>
              </div>
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
                  />{" "}
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
                  <Button onClick={onSubmit}>Add Listing</Button>
                </DialogActions>
              </Dialog>
            </div>
          ) : (
            <div>
              <Button className="butoon" onClick={handleClickOpen}>
                <PersonOutline />
                Login
              </Button>
              <Dialog open={open} onClose={handleClose}>
                <DialogContent>
                  <TextField
                    autoFocus
                    margin="dense"
                    id="username"
                    label="username"
                    type="text"
                    fullWidth
                    variant="standard"
                    onChange={(e) => setUsername(e.target.value)}
                  />
                  <TextField
                    margin="dense"
                    id="password"
                    label="password"
                    type="password"
                    fullWidth
                    variant="standard"
                    onChange={(e) => setPassword(e.target.value)}
                  />
                </DialogContent>
                <DialogActions>
                  <Button onClick={handleClose}>Cancel</Button>
                  <Button onClick={onLogin}>Login</Button>
                </DialogActions>
              </Dialog>
            </div>
          )}
        </ToolBar>
      </AppBar>
    </div>
  );
}
