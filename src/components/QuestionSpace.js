import React from 'react';
import axios from 'axios';
import io from 'socket.io-client';
import './../css/questionspace.css';
import Navbar from './Navbar';
import swal from 'sweetalert';


let socket;

class QuestionSpace extends React.Component {
    constructor(props){
        super(props);
        this.state = {
            stmt : '' ,
            inputf: '',
            outputf : '',
            cnstr : '',
            sinput: '',
            soutput:'',
            expln: '',
            qnum:'',
            file: '',
            msg: '',
            twoQue : true,
            wrongans: false,
            onSkip: '',
            showSkip: true,
            uploadmsg: 'upload',
            uploadResponse:'',
            fileSubmitDisabled: true,
            pyv: 2,
            pydisplay: true,
            showLoading:true,
            errorMsg: '',
            errorMsgBool: false,
            username : ''
        }
        this.skip = this.skip.bind(this);
        this.handlepyvchange = this.handlepyvchange.bind(this);
        socket = io(`http://192.168.43.12:3000`);
            socket.on('connect',()=>{
                console.log("Connected socket");
                if(localStorage.getItem('token')!== null)
                {
                    console.log("Joining");
                    socket.emit('join', localStorage.getItem('token'), (err)=> {
                        console.log(err);
                    })
                }
                let AuthStr = 'Bearer ' + localStorage.getItem('token');
                let URLl     = 'http://192.168.43.12:3000/question/question';
                axios.get(URLl, { headers: { Authorization: AuthStr } }).then(response => {
                // If request is good...
                    console.log(response.data);
                    response.data['showSkip'] = true;
                    this.setState(response.data);
                    this.setState({showLoading:false});
                })
                .catch((error) => {
                    let err=error.response.data.err;
                    if(err==="No Active Question Yet.")
                    {
                        // this.setState()
                        // alert("inside catch");
                        this.setState({
                            msg : "Contact Administrator for new Question",
                            twoQue: false,
                            wrongans: false,
                            showSkip: false,
                            file: '',
                            pydisplay: false,
                            showLoading:false
                        })
                    }

                });

            })

        socket.on('question', (question)=> {
            console.log(question);
            question['twoQue'] = true;
            question['showSkip'] = true;
            question['pydisplay'] = true;
            this.setState(question);
        });
        socket.on('score', (res) => {
            console.log(res);
        })
        socket.on('disconnect', () => {
            console.log("disconnected");
        });
        console.log("Registered");
    }
    fileChange = (event) => {
        let file =event.target.files[0];
        if(file)
        this.setState({file , fileSubmitDisabled: false});
        else
        this.setState({file , fileSubmitDisabled: true});

    }

    handlepyvchange = (e) => {
        let pyvv;
        if(this.state.pyv === 2){
            pyvv = 3;
        }
        else{
            pyvv = 2;
        }
        console.log("checkbox selected is : "+ pyvv);
        this.setState({ pyv: pyvv });
    }

    codeUpload = (event) => {
        event.preventDefault();
        this.setState({fileSubmitDisabled:true})
        const formData = new FormData();
        formData.append('code',this.state.file);
        formData.append('py', this.state.pyv);
        this.setState({uploadmsg: 'uploading..'});
        axios.post('http://192.168.43.12:3000/user/post',
                formData,{
                    headers: {
                        'Authorization' : 'Bearer '+localStorage.getItem('token')
                    }
                }
            ).then((response)=> {
                console.log(response);
                this.setState({uploadmsg: 'upload',uploadResponse: 'File uploaded',fileSubmitDisabled:true});
                document.getElementById("file-upload-form").reset();
                if(response.data.msg==="Wrong Answer") {
                    this.setState({wrongans: false});
                    this.setState({wrongans: true, showSkip: true});

                }
                else if(response.data.msg === "No File Uploaded"){
                    swal({
                        title: "No file Uploaded",
                        icon : "error",
                    });
                    this.setState({file: '',fileSubmitDisabled: false, uploadText: 'upload'});
                }
                else if(response.data.msg === "Invalid File Format") {
                    swal({
                        title: "Invalid file format",
                        icon: "error",
                    })
                    this.setState({file: '',fileSubmitDisabled: false, uploadText: 'upload'});
                }
                else if(response.data.msg !== "Success")
                {
                    swal({
                      title: "Good job!",
                      text: "Successfully submitted!",
                      icon: "success",
                    });
                    response.data['wrongans'] = false;
                    response.data['file'] = '';
                    this.setState(response.data);
                }
                else{
                    swal({
                      title: "Good job!",
                      text: "Successfully submitted!",
                      icon: "success",
                    });
                    this.setState({
                        msg : "Contact Administrator for new Question",
                        twoQue: false,
                        wrongans: false,
                        showSkip: false,
                        file: '',
                        pydisplay: false
                    })
                }
            })
                .catch((err)=> {
                    swal({
                        title : err.response.data.err,
                        icon: "error"
                    })
                    this.setState({file: '',fileSubmitDisabled: false, uploadmsg: 'upload'});
                    document.getElementById("file-upload-form").reset();
                })
            setTimeout(() => {
                this.setState({uploadResponse: ''})
            }, 5000)
    }
    // componentDidMount() {
    //     this.setState({showLoading:true});
    //     let AuthStr = 'Bearer ' + localStorage.getItem('token');
    //     let URLl     = 'http://192.168.43.12:3000/question/question';
    //     axios.get(URLl, { headers: { Authorization: AuthStr } }).then(response => {
    //     // If request is good...
    //         console.log(response.data);
    //         response.data['showSkip'] = true;
    //         this.setState(response.data);
    //         this.setState({showLoading:false});
    //     })
    //     .catch((error) => {
    //         let err=error.response.data.err;
    //         if(err==="No Active Question Yet.")
    //         {
    //             // this.setState()
    //             // alert("inside catch");
    //             this.setState({
    //                 msg : "Contact Administrator for new Question",
    //                 twoQue: false,
    //                 wrongans: false,
    //                 showSkip: false,
    //                 file: '',
    //                 pydisplay: false,
    //                 showLoading:false
    //             })
    //         }
    //
    //     });
    //
    // }

    skip = () => {
        axios.post('http://192.168.43.12:3000/question/skip',{},{
            headers: {
                'Authorization' : 'Bearer '+localStorage.getItem('token')
            }
        })
        .then((response) => {
            console.log(response);
            //response.data.err or Msg
            if(response.data.flag===-1){
                this.setState({
                    msg : "Contact Administrator for new Question",
                    twoQue: false,
                    showSkip: false,
                    wrongans: false,
                    fileSubmitDisabled: true,
                    pydisplay: false
                })
            }
            else if(response.data.msg){
                this.setState({onSkip: response.data.msg})
            }
            else{
                this.setState({onSkip: response.data.msg})
            }
            setTimeout(() => {
                this.setState({onSkip: ''})
            }, 6000);

        })
        .catch ((err) => {
            console.log(err);
        })
    }
    render(){
        const queProps = {
            qnum : this.state.qnum,
            stmt: "jyfujycdyhtdc jhvjvfiuy kuvgii ",
            expln: this.state.expln,
            inputf : this.state.inputf,
            outputf : this.state.outputf,
            sinput : this.state.sinput,
            soutput: this.state.soutput,
            cnstr : this.state.cnstr,
            fileChange: this.fileChange,
            uploadText: this.state.uploadmsg,
            codeUpload: this.codeUpload,
            uploadResponse: this.state.uploadResponse,
            fileSubmitDisabled: this.state.fileSubmitDisabled
        }
        return(
            <div>
                <div className="questionspace-wrapper" style={{minHeight:"100vh"}}>
                    <Navbar ledorque="leaderboard" username={this.state.username} />
                    {/* {this.state.showLoading && <div>

                        <div className="preloader-wrapper big active">
                            <div className="spinner-layer spinner-blue-only">
                                <div className="circle-clipper left">
                                    <div className="circle"></div>
                                </div>
                                <div className="gap-patch">
                                    <div className="circle"></div>
                                </div>
                                <div className="circle-clipper right">
                                    <div className="circle"></div>
                                </div>
                            </div>
                        </div>

                    </div>}
                    {!this.state.showLoading && */}
                    <div className="questionspace-container">
                        {this.state.twoQue && <QueDisplay  que = {queProps} />}
                        <div className="row">
                            <div className="col s6">
                                {!this.state.twoQue && <MsgDisplay msg={this.state.msg} />}
                                { this.state.wrongans && <WrongAnsMsg /> }
                                { this.state.errorMsgBool && <div>
                                    <span>{this.state.errorMsg}</span>
                                </div> }
                                <br />
                                { this.state.showSkip && <Skip run={this.skip} msg={this.state.onSkip} />}
                                <br />
                            </div>
                            <div className="col s6">
                                {/* { this.state.pydisplay && <PyvSwitch changeit={this.handlepyvchange} /> } */}
                                <div className={` ${!this.state.pydisplay? "hideit ":""} switch `}>
                                    <p style={{color: '#fff'}}>Select Version:</p>
                                    <label>
                                        python2
                                        <input type="checkbox" onChange={this.handlepyvchange} />
                                        <span className="lever"></span>
                                        python3
                                    </label>
                                </div>
                            </div>
                        </div>

                    </div>
                {/* } */}
                    <br /><br />
                </div>
            </div>
        );
    };
}

const QueDisplay = (props) => {
    return(
        <div>
            <div className="main-question-wrapper">
                <h4 style={{marginTop: 0}} className="underlinee">Problem {props.que.qnum}: </h4>
                    <p>
                        {props.que.stmt}
                    </p>
                <h5 className="underlinee">Constraints: </h5>
                    <p>
                        {props.que.cnstr}
                    </p>
                <h5 className="underlinee">Input Format: </h5>
                    <p>
                        {props.que.inputf}
                    </p>
                <h5 className="underlinee">Output Format: </h5>
                    <p>
                        {props.que.outputf}
                    </p>
                <h5 className="underlinee">Sample Input: </h5>
                    <p>
                        {props.que.sinput}
                    </p>
                <h5 className="underlinee">Sample Output: </h5>
                    <p>
                        {props.que.soutput}
                    </p>
                <h5 className="underlinee">Explaination: </h5>
                    <p>
                        {props.que.expln}
                    </p>
                <br />
            </div>
            <div className="row">
                <div className="col s12 m6">
                    <form id="file-upload-form">
                    <div className="file-field input-field">
                        <div className="btn file-btn">
                            <span>File</span>
                            <input type="file" onChange={props.que.fileChange} />
                        </div>
                        <div className="file-path-wrapper">
                            <input className="file-path validate" type="text" />
                        </div>
                    </div>
                    <button onClick={props.que.codeUpload} className={` ${props.que.fileSubmitDisabled? "disabled ":""} btn file-btn `}>{props.que.uploadText}</button>
                    <div className="upload-response">{props.que.uploadResponse}</div>
                    </form>

                </div>
                <div className="col s12 m6"></div>
            </div>
        </div>
    )
}


const MsgDisplay = (props) => {
    return (
        <div>
            <h1 style={{color: 'white'}}>{props.msg}</h1>
        </div>
    )
}

class WrongAnsMsg extends React.Component {
    render(){
        return(
            <div className="">
                <h4 style={{color: 'white'}}>Wrong Answer</h4>
            </div>
        );
    }
}

class Skip extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            message: ''
        }
    }
    render(){
        return(
            <div>
                <button onClick={this.props.run} className="btnn">Skip</button>
                <div className="skip-msg"> {this.props.msg} </div>
            </div>
        );
    }
}


export default QuestionSpace;
