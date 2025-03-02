import { useState } from "react";
import axios from "axios";
import Successful from "./successful";
import * as XLSX from 'xlsx'

function Input(){

    const [msg, setmsg] = useState('');
    const[sub, setsub] = useState("");
    const[status, setstatus] = useState(false);
    const[emailList, setemailList] = useState([]);
    const[showsuccess, setshowsuccess] = useState(false);

    const handlemsg = (e) => {
        setmsg(e.target.value)
    }

    const handlesub = (e) => {
        setsub(e.target.value)
    }

    const handlefile = (event) => {
        const file = event.target.files[0];

        const reader = new FileReader();

        reader.onload = function(e){
            const data = e.target.result;
            const workbook = XLSX.read(data, {type:'binary'})
            const sheetname = workbook.SheetNames[0];
            const worksheet = workbook.Sheets[sheetname];
            const emailList = XLSX.utils.sheet_to_json(worksheet,{header:'A'})
            const totalmail = emailList.map((item) => item.A)
            setemailList(totalmail)
        };

        reader.readAsBinaryString(file);
    }


    const send = () => {

        if(msg == '' && sub == ''){
            alert('Please fill the field')
        }
        else{
            
        setstatus(true)

        axios.post('https://bulk-mail-back-jet.vercel.app/mail', {msg:msg, sub:sub, emailList:emailList})
        .then((data) => {

            if(data.data == true){
                setshowsuccess(true)
                setstatus(false)
            }

        }).catch((err) => {
            if(err.data == false){
                alert("failed to send email...")
                setstatus(false)
            }
        })

        setmsg('');
        setsub('');
        setemailList('');
        }
        
    }

    return(
        <div className="input_container">
            <div className="input_field">

                <div style={{ display: showsuccess ? 'block' : 'none' }}>
                    <Successful/>
                </div>

                <h1 className="title">BulkMail</h1>

                <input onChange={handlesub} value={sub} type="text" placeholder="subject..."></input>

                <input onChange={handlefile} type="file"></input>
                <div className="h3box"><h3>Total Emails in the file: <span>{emailList.length}</span></h3></div>

                <textarea onChange={handlemsg} value={msg} placeholder="Message..." cols={24}></textarea>

                <button onClick={send} >{status?"sending...":"send"}</button>

            </div>
        </div>
        
    )
}

export default Input;

