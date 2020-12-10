import React, { Component } from 'react';

export default class review extends Component {
    state = {
        login: false,
    }


    render() {

        return (

            <div className="container">
                <br />
                <br />
                <h1 style={{ textAlign: "center", fontFamily: "Serif", fontWeight: "bold" }}> Tomasulo proccessor Simulation</h1>
                <br />
                <br />
                <br />
                <br />
                <br />
                <textarea type="text" onChange={(e) => this.props.assemblyText(e.target.value)} class="form-control" placeholder="write assemblu code" />
                < button className="bg-success rounded col-2  p-2" onClick={() => this.props.addinstruction(this.props.assembly)}>post</button>
                {this.props.globalclk > 0 ? <h1>{this.props.globalclk}</h1> : null}
                <div className="row">
                    <div class="col-6">
                        <table>
                            <tr>
                                <th>PC</th>
                                <th>instruction</th>
                                <th>Issued</th>
                                <th>Execution</th>
                                <th>Writing back </th>
                            </tr>
                            {

                                this.props.insrtuctions.filter(ins => ins.pc > -1).map(instruction =>
                                    <tr>
                                        <td className={this.props.globalPc === instruction.pc ? "badge-success" : ""}>{instruction.pc}</td>
                                        <td className={this.props.globalPc === instruction.pc ? "badge-success" : ""}>{instruction.instruction}</td>
                                        <td className={this.props.globalPc === instruction.pc ? "badge-success" : ""}>{instruction.Issued}{instruction.issueClk == -1 ? "" : "(" + instruction.issueClk + ")"}</td>
                                        <td className={this.props.globalPc === instruction.pc ? "badge-success" : ""}>{instruction.ex}{instruction.ExClk == -1 ? "" : "(" + instruction.ExClk + ")"}</td>
                                        <td className={this.props.globalPc === instruction.pc ? "badge-success" : ""}>{instruction.Wb}{instruction.WbClk == -1 ? "" : "(" + instruction.WbClk + ")"}</td>
                                    </tr>

                                )
                            }
                        </table>
                    </div >
                    <div class="col-5">
                        <table>
                            <tr>
                                <th>Name</th>
                                <th>busy</th>
                                <th>op</th>
                                <th>vj</th>
                                <th>vk </th>
                                <th>Qj </th>
                                <th>Qk </th>
                                <th>A</th>
                            </tr>
                            {

                                this.props.ReservationStations.map(RS =>
                                    <tr>
                                        <td >{RS.name}</td>
                                        <td >{RS.busy}</td>
                                        <td >{RS.op}</td>
                                        <td >{RS.vj}</td>
                                        <td >{RS.vk}</td>
                                        <td >{RS.Qj}</td>
                                        <td >{RS.Qk}</td>
                                        <td >{RS.A}</td>
                                    </tr>

                                )
                            }
                        </table>
                    </div >

                    <br />
                    <br />
                    <br />
                    <br />
                    {/* <b > */}
                    <br /><br /><br /><br /><br />
                    <div class="row m-5">


                        {

                            this.props.Regs.map(reg =>
                                <table>
                                    <tr>
                                        <th>{reg.reg}</th>

                                    </tr>
                                    <tr> <td >{reg.value}</td></tr>
                                    <tr>
                                        <td >{reg.Qi}</td>

                                    </tr>

                                </table>
                            )
                        }
                        &nbsp;	&nbsp;	&nbsp;
                        {/* < div class="col-6"> */}
                        {this.props.IPC == 0 ? "" :
                            <table>
                                <tr>
                                    <th>Total clk used to finish the program</th>
                                    <th>IPC</th>
                                    <th>Miss Ratio</th>

                                </tr>

                                <tr>
                                    <td >{this.props.globalclk}</td>
                                    <td >{this.props.IPC}</td>
                                    <td >{this.props.missPer}</td>
                                </tr>



                            </table>


                        }

                    </div >

                    {/* </div > */}
                </div >
                < button className="bg-success rounded col-2  p-2 myBtn" onClick={() => this.props.handleglobalPc()}>next</button>
            </div >
        )
    }

}