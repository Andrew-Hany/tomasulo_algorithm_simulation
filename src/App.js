
import React, { Component } from 'react';
import './App.css';
import Ass from './components/assembly';
import { assertFunctionTypeParam } from '@babel/types';
class App extends Component {
  state = {
    assembly: "",
    insrtuctions: [
      { pc: -1, instruction: "", Issued: "", ex: "", Wb: "" }
    ],

    ReservationStations: [
      { name: "LW1", busy: "N", op: "", vj: "", vk: "", Qj: "", Qk: "", A: "", instruction: "" },
      { name: "LW2", busy: "N", op: "", vj: "", vk: "", Qj: "", Qk: "", A: "", instruction: "" },
      { name: "SW1", busy: "N", op: "", vj: "", vk: "", Qj: "", Qk: "", A: "", instruction: "" },
      { name: "SW2", busy: "N", op: "", vj: "", vk: "", Qj: "", Qk: "", A: "", instruction: "" },
      { name: "BEQ", busy: "N", op: "", vj: "", vk: "", Qj: "", Qk: "", A: "", instruction: "" },
      { name: "JALR/RET", busy: "N", op: "", vj: "", vk: "", Qj: "", Qk: "", A: "", instruction: "" },
      { name: "ADD/NEG/ADDI_1", busy: "N", op: "", vj: "", vk: "", Qj: "", Qk: "", A: "", instruction: "" },
      { name: "ADD/NEG/ADDI_2", busy: "N", op: "", vj: "", vk: "", Qj: "", Qk: "", A: "", instruction: "" },
      { name: "DIV", busy: "N", op: "", vj: "", vk: "", Qj: "", Qk: "", instruction: "" },
    ],
    //regs /// x6
    data: [],

    Regs: [
      { reg: "x0", Qi: "", used: 0, value: 0 },
      { reg: "x1", Qi: "", used: 0, value: 1 },
      { reg: "x2", Qi: "", used: 0, value: 1 },
      { reg: "x3", Qi: "", used: 0, value: 6 },
      { reg: "x4", Qi: "", used: 0, value: 1 },
      { reg: "x5", Qi: "", used: 0, value: 1 },
      { reg: "x6", Qi: "", used: 0, value: 1 },
      { reg: "x7", Qi: "", used: 0, value: 1 },
    ],

    globalPc: 0,
    globalclk: 0,


    //IPC
    TotalInstructin: 0,
    IPC: 0.0,

    //miss 
    branchcount: 0,
    missNom: 0,
    missPer: 0,
    //beq
    beqstart: -1,
    jumbbeq: -1,
    beqflag: -1,
    //jalr
    jalrstart: -1,
    jubmjalr: -1,
    jalflag: -1,

    //indication to end the clk 
    clkflag: 0,
    lastinstructionPC: 0,
    maxPC: 0,

    jalrMax: 0,
  };
  assemblyText = (e) => {
    this.setState({ assembly: e })
  }
  addinstruction = (assmebly) => {
    var empty = [];
    this.setState(this.state.insrtuctions = empty)
    // assmebly = assmebly + "\n";
    var res = assmebly.split(";");
    const variable = [...this.state.insrtuctions]
    const datamem = [...this.state.data]
    for (var i = 0; i < res.length - 1; i++) {
      if (res[i].search("lw") > -1)
        variable[i] = { pc: i, instruction: res[i], Issued: " ", issueClk: -1, ex: " ", ExClk: -1, count: 2, Wb: " ", WbClk: -1, done: -1 }
      else if (res[i].search("sw") > -1)
        variable[i] = { pc: i, instruction: res[i], Issued: " ", issueClk: -1, ex: " ", ExClk: -1, count: 2, Wb: " ", WbClk: -1, done: -1 }
      else if (res[i].search("add") > -1)
        variable[i] = { pc: i, instruction: res[i], Issued: " ", issueClk: -1, ex: " ", ExClk: -1, count: 2, Wb: " ", WbClk: -1, done: -1 }
      else if (res[i].search("neg") > -1)
        variable[i] = { pc: i, instruction: res[i], Issued: " ", issueClk: -1, ex: " ", ExClk: -1, count: 2, Wb: " ", WbClk: -1, done: -1 }
      else if (res[i].search("div") > -1)
        variable[i] = { pc: i, instruction: res[i], Issued: " ", issueClk: -1, ex: " ", ExClk: -1, count: 8, Wb: " ", WbClk: -1, done: -1 }
      else if (res[i].search("addi") > -1)
        variable[i] = { pc: i, instruction: res[i], Issued: " ", issueClk: -1, ex: " ", ExClk: -1, count: 2, Wb: " ", WbClk: -1, done: -1 }
      else if (res[i].search("beq") > -1)
        variable[i] = { pc: i, instruction: res[i], Issued: " ", issueClk: -1, ex: " ", ExClk: -1, count: 1, Wb: " ", WbClk: -1, done: -1 }
      else if (res[i].search("jalr") > -1)
        variable[i] = { pc: i, instruction: res[i], Issued: " ", issueClk: -1, ex: " ", ExClk: -1, count: 1, Wb: " ", WbClk: -1, done: -1 }
      else if (res[i].search("ret") > -1)
        variable[i] = { pc: i, instruction: res[i], Issued: " ", issueClk: -1, ex: " ", ExClk: -1, count: 1, Wb: " ", WbClk: -1, done: -1 }

      else
        variable[i] = { pc: i, instruction: res[i], Issued: " ", issueClk: -1, ex: " ", ExClk: -1, count: 10000, Wb: " ", WbClk: -1, }
    }
    this.setState({ lastinstructionPC: variable.length - 1 })
    for (var j = 0; j < 65536; j++) {
      datamem[j] = { value: 0 };
    }

    this.setState(this.state.insrtuctions = variable)
    console.log(this.state.insrtuctions);
    this.setState({ globalPc: 0 })
    this.setState({ globalclk: 0 })
    this.setState({ jumbbeq: -1 })
    this.setState({ beqstart: -1 })
    this.setState(this.state.data = datamem)
    console.log(this.state.data);
    this.setState({ clkflag: 0 })
    this.setState({ maxPC: 0 });
    this.setState({ TotalInstructin: 0 });
    this.setState({ IPC: 0 });
    this.setState({ missPer: 0 });
    this.setState({ missNom: 0 });
    this.setState({ branchcount: 0 });
  }

  handleglobalPc = () => {

    // console.log(this.state.insrtuctions);
    // console.log(this.state.globalPc);

    const variable = [...this.state.insrtuctions]
    const RS = [...this.state.ReservationStations]
    const regs = [...this.state.Regs];
    const datamem = [...this.state.data]
    var operands = [];

    var PC = this.state.globalPc;



    //pc 
    var RS1;
    var RS2 = "";
    var RD = "";
    var temp;
    var imm = "";
    var jumb;
    var beqflag;
    var jalflag;
    var jumbjal;




    for (var i = 0; i <= PC; i++) {
      operands = this.state.insrtuctions[i].instruction.replace(" ", ",")
      operands = operands.split(",");
      // lw rs, 10(rs2)
      if (this.state.insrtuctions[i].instruction.search("addi") > -1) {
        RD = operands[1];
        RS1 = operands[2];
        imm = operands[3];
        console.log(operands);
      }

      else if (this.state.insrtuctions[i].instruction.search("add") > -1) {
        RD = operands[1];
        RS1 = operands[2];
        RS2 = operands[3];
        console.log(operands);
        // console.log(RD);
      }
      else if (this.state.insrtuctions[i].instruction.search("lw") > -1) {
        RD = operands[1];//x10
        temp = operands[2].split("(");
        imm = temp[0];
        // RS1
        RS1 = temp[1].replace(")", "");
        // console.log(RS2);

      }
      else if (this.state.insrtuctions[i].instruction.search("neg") > -1) {
        RD = operands[1];
        RS1 = operands[2];

        console.log(operands);

      }
      else if (this.state.insrtuctions[i].instruction.search("div") > -1) {
        RD = operands[1];
        RS1 = operands[2];
        RS2 = operands[3];
        console.log(operands);

      }
      else if (this.state.insrtuctions[i].instruction.search("sw") > -1) {
        //sw rs2,10(rs1)

        RS2 = operands[1];

        temp = operands[2].split("(");
        imm = temp[0];
        // RS1
        RS1 = temp[1].replace(")", "");
        // console.log(operands);

      }
      else if (this.state.insrtuctions[i].instruction.search("beq") > -1) {


        RS1 = operands[1];
        RS2 = operands[2];
        imm = operands[3];
        console.log(operands);

      }
      else if (this.state.insrtuctions[i].instruction.search("jalr") > -1) {


        RS1 = operands[1];

        console.log(operands);

      }
      /*
add x1,x2,x3;
addi x6,x7,10;
add x0,x0,x7;
lw x1,10(x2);
neg x1,x5;
div x2,x3,x2;
sw x1,10(x2);
*/

      console.log("this.state.beqstart   " + this.state.beqstart);
      for (var j = 0; j < 9; j++) {

        // console.log(RS.length)
        // console.log(this.state.ReservationStations[j].name.search("LW") + this.state.insrtuctions[i].instruction.search("lw") + this.state.ReservationStations[j].busy);
        //---------------------------------------------issued----------------------------------------------------------------------------------//
        if (this.state.insrtuctions[i].Issued === " " && (this.state.jumbbeq == -1 || this.state.jumbbeq <= i || this.state.beqstart > i) && (this.state.jalflag != 1 && (this.state.jubmjalr <= i || this.state.jalrstart > i))) {
          if (this.state.ReservationStations[j].name.search("LW") > -1 &&
            this.state.ReservationStations[j].busy === "N" &&
            this.state.insrtuctions[i].instruction.search("lw") > -1) {
            variable[i].Issued = "Issued";
            variable[i].issueClk = this.state.globalclk + 1;
            RS[j].busy = "Y";
            RS[j].op = operands[0];
            RS[j].vj = RS1;
            RS[j].vk = RS2;
            RS[j].instruction = variable[i].instruction;
            RS[j].A = parseInt(imm) + parseInt(regs[RS1.split("x")[1]].value);
            var tempreg = RD.split("x")[1];

            regs[tempreg].Qi = operands[0];
            console.log(imm);
            break;
          }
          else if (this.state.ReservationStations[j].name.search("ADDI") > -1 && this.state.ReservationStations[j].busy === "N" && this.state.insrtuctions[i].instruction.search("addi") > -1) {
            variable[i].Issued = "Issued";
            variable[i].issueClk = this.state.globalclk + 1;
            RS[j].busy = "Y";
            RS[j].op = operands[0];
            RS[j].vj = RS1;
            RS[j].vk = imm;
            RS[j].instruction = variable[i].instruction;
            // RS[j].A = imm;
            var tempreg = RD.split("x")[1];

            regs[tempreg].Qi = operands[0];
            console.log(tempreg);
            break;
          }
          else if (this.state.ReservationStations[j].name.search("ADD") > -1 && this.state.ReservationStations[j].busy === "N" && this.state.insrtuctions[i].instruction.search("add") > -1) {
            variable[i].Issued = "Issued";
            variable[i].issueClk = this.state.globalclk + 1;
            RS[j].busy = "Y";
            RS[j].op = operands[0];
            RS[j].vj = RS1;
            RS[j].vk = RS2;
            // RS[j].A = imm;
            RS[j].instruction = variable[i].instruction;
            var tempreg = RD.split("x")[1];

            regs[tempreg].Qi = operands[0];
            console.log(tempreg);
            break;
          }
          else if (this.state.ReservationStations[j].name.search("NEG") > -1 && this.state.ReservationStations[j].busy === "N" && this.state.insrtuctions[i].instruction.search("neg") > -1) {
            variable[i].Issued = "Issued";
            variable[i].issueClk = this.state.globalclk + 1;
            RS[j].busy = "Y";
            RS[j].op = operands[0];
            RS[j].vj = RS1;
            RS[j].instruction = variable[i].instruction;

            var tempreg = RD.split("x")[1];
            regs[tempreg].Qi = operands[0];
            console.log(tempreg);
            break;
          }
          else if (this.state.ReservationStations[j].name.search("DIV") > -1 && this.state.ReservationStations[j].busy === "N" && this.state.insrtuctions[i].instruction.search("div") > -1) {
            variable[i].Issued = "Issued";
            variable[i].issueClk = this.state.globalclk + 1;
            RS[j].busy = "Y";
            RS[j].op = operands[0];
            RS[j].vj = RS1;
            RS[j].instruction = variable[i].instruction;
            RS[j].vk = RS2;

            var tempreg = RD.split("x")[1];

            regs[tempreg].Qi = operands[0];
            console.log(tempreg);
            break;
          } else if (this.state.ReservationStations[j].name.search("SW") > -1 && this.state.ReservationStations[j].busy === "N" && this.state.insrtuctions[i].instruction.search("sw") > -1) {
            variable[i].Issued = "Issued";
            variable[i].issueClk = this.state.globalclk + 1;
            RS[j].busy = "Y";
            RS[j].op = operands[0];
            RS[j].vj = RS1;
            RS[j].vk = RS2;
            RS[j].instruction = variable[i].instruction;
            RS[j].A = parseInt(imm) + parseInt(regs[RS1.split("x")[1]].value);

            // var tempreg = RD.split("x")[1];

            // // regs[tempreg].Qi = operands[0];
            // console.log(imm);
            break;
          }
          else if (this.state.ReservationStations[j].name.search("BEQ") > -1 && this.state.ReservationStations[j].busy === "N" && this.state.insrtuctions[i].instruction.search("beq") > -1) {
            variable[i].Issued = "Issued";
            variable[i].issueClk = this.state.globalclk + 1;
            RS[j].busy = "Y";
            RS[j].op = operands[0];
            RS[j].vj = RS1;
            RS[j].vk = RS2;
            RS[j].instruction = variable[i].instruction;
            this.setState({ beqstart: i })
            // RS[j].A = parseInt(imm) + parseInt(regs[RS1.split("x")[1]].value);

            // var tempreg = RD.split("x")[1];

            // // regs[tempreg].Qi = operands[0];
            // console.log(imm);
            break;
          }
          else if (this.state.ReservationStations[j].name.search("JALR") > -1 && this.state.ReservationStations[j].busy === "N" && this.state.insrtuctions[i].instruction.search("jalr") > -1) {
            variable[i].Issued = "Issued";
            variable[i].issueClk = this.state.globalclk + 1;
            RS[j].busy = "Y";
            RS[j].op = operands[0];
            RS[j].vj = RS1;
            // RS[j].vk = RS2;
            this.setState({ jalrstart: i })

            jalflag = 1;
            this.setState({ jalflag: jalflag })
            RS[j].instruction = variable[i].instruction;
            break;
          }
          else if (this.state.ReservationStations[j].name.search("RET") > -1 && this.state.ReservationStations[j].busy === "N" && this.state.insrtuctions[i].instruction.search("ret") > -1) {
            variable[i].Issued = "Issued";
            variable[i].issueClk = this.state.globalclk + 1;
            RS[j].busy = "Y";
            RS[j].op = operands[0];
            RS[j].instruction = variable[i].instruction;

            // RS[j].vk = RS2;
            // this.setState({ jalrstart: i })


            break;
          }


        }

        else if (this.state.insrtuctions[i].Issued === "Issued" && this.state.insrtuctions[i].ex === " " && (this.state.jumbbeq == -1 || this.state.jumbbeq <= i || this.state.beqstart > i)) {
          if (this.state.insrtuctions[i].instruction.search("lw") > -1 && this.state.insrtuctions[i].count - 1 == 0) { variable[i].ex = "executed"; variable[i].ExClk = this.state.globalclk + 1; break; }
          else if (this.state.insrtuctions[i].instruction.search("sw") > -1 && this.state.insrtuctions[i].count - 1 == 0) { variable[i].ex = "executed"; variable[i].ExClk = this.state.globalclk + 1; break; }
          else if (this.state.insrtuctions[i].instruction.search("addi") > -1 && this.state.insrtuctions[i].count - 1 == 0) { variable[i].ex = "executed"; variable[i].ExClk = this.state.globalclk + 1; break; }
          else if (this.state.insrtuctions[i].instruction.search("add") > -1 && this.state.insrtuctions[i].count - 1 == 0) { variable[i].ex = "executed"; variable[i].ExClk = this.state.globalclk + 1; break; }
          else if (this.state.insrtuctions[i].instruction.search("neg") > -1 && this.state.insrtuctions[i].count - 1 == 0) { variable[i].ex = "executed"; variable[i].ExClk = this.state.globalclk + 1; break; }
          else if (this.state.insrtuctions[i].instruction.search("div") > -1 && this.state.insrtuctions[i].count - 1 == 0) { variable[i].ex = "executed"; variable[i].ExClk = this.state.globalclk + 1; break; }
          else if (this.state.insrtuctions[i].instruction.search("sw") > -1 && this.state.insrtuctions[i].count - 1 == 0) { variable[i].ex = "executed"; variable[i].ExClk = this.state.globalclk + 1; break; }
          else if (this.state.insrtuctions[i].instruction.search("beq") > -1 && this.state.insrtuctions[i].count - 1 == 0) { variable[i].ex = "executed"; variable[i].ExClk = this.state.globalclk + 1; break; }
          else if (this.state.insrtuctions[i].instruction.search("jalr") > -1 && this.state.insrtuctions[i].count - 1 == 0) { variable[i].ex = "executed"; variable[i].ExClk = this.state.globalclk + 1; break; }
          else if (this.state.insrtuctions[i].instruction.search("ret") > -1 && this.state.insrtuctions[i].count - 1 == 0) { variable[i].ex = "executed"; variable[i].ExClk = this.state.globalclk + 1; break; }
          else {
            // console.log("count" + this.state.insrtuctions[i].count);
            // if (RS1==RD ||RS2==RD )
            if (this.state.insrtuctions[i].instruction.search("sw") > -1)
              ;
            else {
              var tempreg2 = RD.split("x")[1];
              regs[tempreg2].Qi = operands[0];
              regs[tempreg2].used = i;
            }



            // console.log(tempreg2 + regs[tempreg2].Qi);

            var tempRS1 = RS1.split("x")[1];
            var tempRS2 = RS2.split("x")[1];

            // console.log(+PC + " " + regs[tempRS1].used)
            console.log(this.state.insrtuctions[i].instruction);

            if ((this.state.insrtuctions[i].instruction.search("addi") > -1) || (this.state.insrtuctions[i].instruction.search("neg") > -1) || (this.state.insrtuctions[i].instruction.search("lw") > -1)) {

              if (regs[tempRS1].used != i) {
                if ((regs[tempRS1].Qi == "")) {
                  variable[i].count = variable[i].count - 1;
                  break;
                } else {
                  console.log("variable[i].count" + variable[i].count);
                  var pl;
                  if (variable[i].count == 2)
                    variable[i].count = 2 + 1;
                  else if (variable[i].count == 8)
                    variable[i].count = 8 + 1;

                  break
                }
              }
              else {
                variable[i].count = variable[i].count - 1;
                break;
              }
            }
            else {

              if (regs[tempRS1].used != i && regs[tempRS2].used != i) {
                // console.log("zeft" + tempRS1)
                if ((regs[tempRS1].Qi == "" && regs[tempRS2].Qi == "")) {
                  // console.log("zeftnum" + tempRS1);
                  variable[i].count = variable[i].count - 1;//count 2 1 
                  break;
                }
                else {
                  console.log("variable[i].count" + variable[i].count);
                  var pl;
                  if (variable[i].count == 2)
                    variable[i].count = 2 + 1;
                  else if (variable[i].count == 8)
                    variable[i].count = 8 + 1;

                  break
                }
                ;
              }
              else {
                variable[i].count = variable[i].count - 1;
                break;
              }
            }
          }
        }
        else if (this.state.insrtuctions[i].Issued == "Issued" && this.state.insrtuctions[i].ex == "executed" && this.state.insrtuctions[i].Wb == " " && (this.state.jumbbeq == -1 || this.state.jumbbeq <= i || this.state.beqstart + 1 >= i)) {

          this.setState({ TotalInstructin: this.state.TotalInstructin + 1 })

          if (this.state.insrtuctions[i].instruction.search("sw") > -1 || this.state.insrtuctions[i].instruction.search("beq") > -1 || this.state.insrtuctions[i].instruction.search("jalr") > -1)
            ;
          else {
            var tempRD = RD.split("x")[1];
            regs[tempRD].Qi = "";
          }

          if (this.state.insrtuctions[i].instruction.search("jalr") > -1)
            ;
          else {
            var tempRs1 = RS1.split("x")[1];
            var tempRs2 = RS2.split("x")[1];
          }
          // console.log(regs[tempRS1].Qi + "ASDadasdsa" + regs[tempRS1].reg);
          variable[i].Wb = "writing back";
          variable[i].WbClk = this.state.globalclk + 1;
          //add
          if (this.state.insrtuctions[i].instruction.search("addi") > -1) {

            if (tempRD != 0)
              regs[tempRD].value = parseInt(regs[tempRs1].value) + parseInt(imm);
            console.log(imm);
            break;
          }
          else if (this.state.insrtuctions[i].instruction.search("add") > -1) {
            if (tempRD != 0)
              regs[tempRD].value = regs[tempRs1].value + regs[tempRs2].value;
            console.log(tempRD);
            break;
          }
          else if (this.state.insrtuctions[i].instruction.search("lw") > -1) {
            if (tempRD != 0)
              regs[tempRD].value = this.state.data[RS[j].A].value;
            break;
            // console.log(this.state.data[RS[j].A] + " " + regs[tempRD].value);
          }
          else if (this.state.insrtuctions[i].instruction.search("neg") > -1) {
            if (tempRD != 0)
              regs[tempRD].value = - regs[tempRs1].value;
            break;
            // console.log(this.state.data[RS[j].A] + " " + regs[tempRD].value);
          }
          else if (this.state.insrtuctions[i].instruction.search("div") > -1) {
            if (tempRD != 0)
              regs[tempRD].value = regs[tempRs1].value / regs[tempRs2].value;
            break;
            // console.log(this.state.data[RS[j].A] + " " + regs[tempRD].value);
          }
          else if (this.state.insrtuctions[i].instruction.search("sw") > -1) {
            var address = parseInt(imm) + parseInt(regs[tempRs1].value);
            datamem[address].value = regs[tempRs2].value;
            console.log(address);
            break;
          }
          //imm*2+pc

          else if (this.state.insrtuctions[i].instruction.search("beq") > -1) {
            var tempRs1 = RS1.split("x")[1];
            var tempRs2 = RS2.split("x")[1];
            console.log("RS1 " + regs[tempRs1].value + "RS2 " + regs[tempRs2].value)
            if (regs[tempRs1].value == regs[tempRs2].value) {
              if (parseInt(imm) > 0)
                jumb = parseInt(imm) + (i) + 1; // 0+  2 
              else
                jumb = parseInt(imm) + (i) - 1;//-1+2-1


              beqflag = 1;
              this.setState({ missNom: this.state.missNom + 1 })
            }
            else {
              beqflag = -1; jumb = -1;

            }

            this.setState({ jumbbeq: jumb })
            if (this.state.jalrMax < jumb)
              this.setState({ jalrMax: jumb })
            console.log("this.state.jalrMax" + this.state.jalrMax)
            this.setState({ branchcount: this.state.branchcount + 1 })

            break;
          }
          else if (this.state.insrtuctions[i].instruction.search("jalr") > -1) {
            var tempRs1 = RS1.split("x")[1];

            jumbjal = parseInt(regs[tempRs1].value) + (i) + 1; //not sure about the immediate   4*2
            jalflag = 1;
            this.setState({ jubmjalr: jumbjal })
            this.setState({ lastinstructionPC: jumbjal - 1 })
            regs[1].value = (i) + 1;


            break;
          }
          else if (this.state.insrtuctions[i].instruction.search("ret") > -1) {
            jumbjal = parseInt(regs[1].value); //not sure about the immediate   4*2

            this.setState({ jubmjalr: jumbjal })
            jalflag = 1;
            this.setState({ jalflag: jalflag })

            break;
          }
        }
        else if (this.state.insrtuctions[i].Wb === "writing back" && this.state.ReservationStations[j].name.search("LW") > -1
          && this.state.ReservationStations[j].busy === "Y" && this.state.insrtuctions[i].instruction.search("lw") > -1 &&
          this.state.ReservationStations[j].op.search("lw") > -1 && this.state.insrtuctions[i].instruction == this.state.ReservationStations[j].instruction) {
          RS[j].busy = "N";
          RS[j].op = "";
          RS[j].vj = "";
          RS[j].vk = "";
          RS[j].A = "";
          console.log(RS);
          break;
        }
        else if (this.state.insrtuctions[i].Wb === "writing back" && this.state.insrtuctions[i].done === -1 && this.state.ReservationStations[j].name.search("ADDI") > -1 && this.state.ReservationStations[j].busy === "Y" && this.state.insrtuctions[i].instruction.search("addi") > -1 && this.state.ReservationStations[j].op.search("addi") > -1
          && this.state.insrtuctions[i].instruction == this.state.ReservationStations[j].instruction) {
          RS[j].busy = "N";
          RS[j].op = "";
          RS[j].vj = "";
          RS[j].vk = "";
          RS[j].A = "";
          variable[i].done = 1;
          console.log(RS);
          break;
        }
        else if (this.state.insrtuctions[i].Wb === "writing back" && this.state.insrtuctions[i].done === -1 && this.state.ReservationStations[j].name.search("ADD") > -1 && this.state.ReservationStations[j].busy === "Y" && this.state.insrtuctions[i].instruction.search("add") > -1 && this.state.ReservationStations[j].op.search("add") > -1
          && this.state.insrtuctions[i].instruction == this.state.ReservationStations[j].instruction) {
          RS[j].busy = "N";
          RS[j].op = "";
          RS[j].vj = "";
          RS[j].vk = "";
          variable[i].done = 1;
          console.log(RS);
          break;
        }
        else if (this.state.insrtuctions[i].Wb === "writing back" && this.state.insrtuctions[i].done === -1 && this.state.ReservationStations[j].name.search("NEG") > -1 && this.state.ReservationStations[j].busy === "Y" && this.state.insrtuctions[i].instruction.search("neg") > -1 && this.state.ReservationStations[j].op.search("neg") > -1
          && this.state.insrtuctions[i].instruction == this.state.ReservationStations[j].instruction) {
          RS[j].busy = "N";
          RS[j].op = "";
          RS[j].vj = "";
          RS[j].vk = "";
          variable[i].done = 1;
          console.log(RS);
          break;
        }
        else if (this.state.insrtuctions[i].Wb === "writing back" && this.state.insrtuctions[i].done === -1 && this.state.ReservationStations[j].name.search("DIV") > -1 && this.state.ReservationStations[j].busy === "Y" && this.state.insrtuctions[i].instruction.search("div") > -1 && this.state.ReservationStations[j].op.search("div") > -1
          && this.state.insrtuctions[i].instruction == this.state.ReservationStations[j].instruction) {
          RS[j].busy = "N";
          RS[j].op = "";
          RS[j].vj = "";
          RS[j].vk = "";
          variable[i].done = 1;
          // console.log(RS);
          break;
        }
        else if (this.state.insrtuctions[i].Wb === "writing back" && this.state.insrtuctions[i].done === -1 && this.state.ReservationStations[j].name.search("BEQ") > -1 && this.state.ReservationStations[j].busy === "Y" && this.state.insrtuctions[i].instruction.search("beq") > -1 && this.state.ReservationStations[j].op.search("beq") > -1
          && this.state.insrtuctions[i].instruction == this.state.ReservationStations[j].instruction) {
          RS[j].busy = "N";
          RS[j].op = "";
          RS[j].vj = "";
          RS[j].vk = "";
          variable[i].done = 1;
          console.log(this.state.globalPc + " " + this.state.jumbbeq);
          // this.setState({ globalPc: this.state.jumbbeq })
          break;
        }
        else if (this.state.insrtuctions[i].Wb === "writing back" && this.state.insrtuctions[i].done === -1 && this.state.ReservationStations[j].name.search("SW") > -1 && this.state.ReservationStations[j].busy === "Y" && this.state.insrtuctions[i].instruction.search("sw") > -1 && this.state.ReservationStations[j].op.search("sw") > -1
          && this.state.insrtuctions[i].instruction == this.state.ReservationStations[j].instruction) {
          RS[j].busy = "N";
          RS[j].op = "";
          RS[j].vj = "";
          RS[j].vk = "";
          RS[j].A = "";
          variable[i].done = 1;

          break;
        }
        else if (this.state.insrtuctions[i].Wb === "writing back" && this.state.insrtuctions[i].done === -1 && this.state.ReservationStations[j].name.search("JALR") > -1 && this.state.ReservationStations[j].busy === "Y" && this.state.insrtuctions[i].instruction.search("jalr") > -1 && this.state.ReservationStations[j].op.search("jalr") > -1
          && this.state.insrtuctions[i].instruction == this.state.ReservationStations[j].instruction) {
          RS[j].busy = "N";
          RS[j].op = "";
          RS[j].vj = "";
          RS[j].vk = "";
          RS[j].A = "";
          variable[i].done = 1;

          break;
        }
        else if (this.state.insrtuctions[i].Wb === "writing back" && this.state.insrtuctions[i].done === -1 && this.state.ReservationStations[j].name.search("RET") > -1 && this.state.ReservationStations[j].busy === "Y" && this.state.insrtuctions[i].instruction.search("ret") > -1 && this.state.ReservationStations[j].op.search("ret") > -1
          && this.state.insrtuctions[i].instruction == this.state.ReservationStations[j].instruction) {
          RS[j].busy = "N";
          RS[j].op = "";
          RS[j].vj = "";
          RS[j].vk = "";
          RS[j].A = "";
          variable[i].done = 1;

          break;
        }



      }


    }



    // if (this.state.jumbbeq > -1 && this.state.beqflag == 1)


    // ----------------Deleting the issue and executing and Writing back of the instructins --------
    if (this.state.beqstart != -1 && this.state.insrtuctions[this.state.beqstart].Wb == "writing back" && beqflag == 1 && (jumb < this.state.beqstart)) {
      for (var x = jumb; x <= this.state.beqstart; x = x + 1) {
        if (variable[x].instruction.search("lw") > -1)
          variable[x] = { pc: x, instruction: variable[x].instruction, Issued: " ", issueClk: -1, ex: " ", ExClk: -1, count: 2, Wb: " ", WbClk: -1, done: -1 }
        else if (variable[x].instruction.search("sw") > -1)
          variable[x] = { pc: x, instruction: variable[x].instruction, Issued: " ", issueClk: -1, ex: " ", ExClk: -1, count: 2, Wb: " ", WbClk: -1, done: -1 }
        else if (variable[x].instruction.search("add") > -1)
          variable[x] = { pc: x, instruction: variable[x].instruction, Issued: " ", issueClk: -1, ex: " ", ExClk: -1, count: 2, Wb: " ", WbClk: -1, done: -1 }
        else if (variable[x].instruction.search("neg") > -1)
          variable[x] = { pc: x, instruction: variable[x].instruction, Issued: " ", issueClk: -1, ex: " ", ExClk: -1, count: 2, Wb: " ", WbClk: -1, done: -1 }
        else if (variable[x].instruction.search("div") > -1)
          variable[x] = { pc: x, instruction: variable[x].instruction, Issued: " ", issueClk: -1, ex: " ", ExClk: -1, count: 8, Wb: " ", WbClk: -1, done: -1 }
        else if (variable[x].instruction.search("addi") > -1)
          variable[x] = { pc: x, instruction: variable[x].instruction, Issued: " ", issueClk: -1, ex: " ", ExClk: -1, count: 2, Wb: " ", WbClk: -1, done: -1 }
        else if (variable[x].instruction.search("beq") > -1)
          variable[x] = { pc: x, instruction: variable[x].instruction, Issued: " ", issueClk: -1, ex: " ", ExClk: -1, count: 1, Wb: " ", WbClk: -1, done: -1 }
        else if (variable[x].instruction.search("jalr") > -1)
          variable[x] = { pc: x, instruction: variable[x].instruction, Issued: " ", issueClk: -1, ex: " ", ExClk: -1, count: 1, Wb: " ", WbClk: -1, done: -1 }
        else if (variable[x].instruction.search("ret") > -1)
          variable[x] = { pc: x, instruction: variable[x].instruction, Issued: " ", issueClk: -1, ex: " ", ExClk: -1, count: 1, Wb: " ", WbClk: -1, done: -1 }

        else
          variable[x] = { pc: x, instruction: variable[x].instruction, Issued: " ", issueClk: -1, ex: " ", ExClk: -1, count: 10000, Wb: " ", WbClk: -1, }

        if (this.state.insrtuctions[x].instruction.search("sw") > -1 || this.state.insrtuctions[x].instruction.search("beq") > -1)
          ;
        else {
          operands = this.state.insrtuctions[x].instruction.replace(" ", ",")
          operands = operands.split(",");
          RD = operands[1];

          var tempRD = RD.split("x")[1];
          regs[tempRD].Qi = "";
        }

      }
      for (var x = this.state.beqstart; x <= PC; x = x + 1) {
        if (variable[x].instruction.search("lw") > -1)
          variable[x] = { pc: x, instruction: variable[x].instruction, Issued: " ", issueClk: -1, ex: " ", ExClk: -1, count: 2, Wb: " ", WbClk: -1, }
        else if (variable[x].instruction.search("sw") > -1)
          variable[x] = { pc: x, instruction: variable[x].instruction, Issued: " ", issueClk: -1, ex: " ", ExClk: -1, count: 2, Wb: " ", WbClk: -1, }
        else if (variable[x].instruction.search("add") > -1)
          variable[x] = { pc: x, instruction: variable[x].instruction, Issued: " ", issueClk: -1, ex: " ", ExClk: -1, count: 2, Wb: " ", WbClk: -1, }
        else if (variable[x].instruction.search("neg") > -1)
          variable[x] = { pc: x, instruction: variable[x].instruction, Issued: " ", issueClk: -1, ex: " ", ExClk: -1, count: 2, Wb: " ", WbClk: -1, }
        else if (variable[x].instruction.search("div") > -1)
          variable[x] = { pc: x, instruction: variable[x].instruction, Issued: " ", issueClk: -1, ex: " ", ExClk: -1, count: 8, Wb: " ", WbClk: -1, }
        else if (variable[x].instruction.search("addi") > -1)
          variable[x] = { pc: x, instruction: variable[x].instruction, Issued: " ", issueClk: -1, ex: " ", ExClk: -1, count: 2, Wb: " ", WbClk: -1, }
        else if (variable[x].instruction.search("beq") > -1)
          variable[x] = { pc: x, instruction: variable[x].instruction, Issued: " ", issueClk: -1, ex: " ", ExClk: -1, count: 1, Wb: " ", WbClk: -1, }
        else if (variable[x].instruction.search("jalr") > -1)
          variable[x] = { pc: x, instruction: variable[x].instruction, Issued: " ", issueClk: -1, ex: " ", ExClk: -1, count: 1, Wb: " ", WbClk: -1, }
        else if (variable[x].instruction.search("ret") > -1)
          variable[x] = { pc: x, instruction: variable[x].instruction, Issued: " ", issueClk: -1, ex: " ", ExClk: -1, count: 1, Wb: " ", WbClk: -1, }

        else
          variable[x] = { pc: x, instruction: variable[x].instruction, Issued: " ", issueClk: -1, ex: " ", ExClk: -1, count: 10000, Wb: " ", WbClk: -1, }

        if (this.state.insrtuctions[x].instruction.search("sw") > -1 || this.state.insrtuctions[x].instruction.search("beq") > -1)
          ;
        else {
          operands = this.state.insrtuctions[x].instruction.replace(" ", ",")
          operands = operands.split(",");
          RD = operands[1];

          var tempRD = RD.split("x")[1];
          regs[tempRD].Qi = "";
        }

      }
      RS[4].busy = "N";
      RS[4].op = "";
      RS[4].vj = "";
      RS[4].vk = "";
      RS[4].A = "";


      for (var x = this.state.beqstart; x <= PC; x = x + 1) {
        for (var j = 0; j < 9; j++) {

          if (this.state.ReservationStations[j].name.search("LW") > -1
            && this.state.ReservationStations[j].busy === "Y" && this.state.insrtuctions[x].instruction.search("lw") > -1 &&
            this.state.ReservationStations[j].op.search("lw") > -1 && this.state.insrtuctions[x].instruction == this.state.ReservationStations[j].instruction) {
            RS[j].busy = "N";
            RS[j].op = "";
            RS[j].vj = "";
            RS[j].vk = "";
            RS[j].A = "";
            console.log(RS);
            break;
          }
          else if (this.state.ReservationStations[j].name.search("ADDI") > -1 && this.state.ReservationStations[j].busy === "Y" && this.state.insrtuctions[x].instruction.search("addi") > -1 && this.state.ReservationStations[j].op.search("addi") > -1
            && this.state.insrtuctions[x].instruction == this.state.ReservationStations[j].instruction) {
            RS[j].busy = "N";
            RS[j].op = "";
            RS[j].vj = "";
            RS[j].vk = "";
            RS[j].A = "";
            variable[x].done = 1;
            console.log(RS);
            break;
          }
          else if (this.state.ReservationStations[j].name.search("ADD") > -1 && this.state.ReservationStations[j].busy === "Y" && this.state.insrtuctions[x].instruction.search("add") > -1 && this.state.ReservationStations[j].op.search("add") > -1
            && this.state.insrtuctions[x].instruction == this.state.ReservationStations[j].instruction) {
            RS[j].busy = "N";
            RS[j].op = "";
            RS[j].vj = "";
            RS[j].vk = "";
            variable[x].done = 1;
            console.log(RS);
            break;
          }
          else if (this.state.ReservationStations[j].name.search("NEG") > -1 && this.state.ReservationStations[j].busy === "Y" && this.state.insrtuctions[x].instruction.search("neg") > -1 && this.state.ReservationStations[j].op.search("neg") > -1
            && this.state.insrtuctions[x].instruction == this.state.ReservationStations[j].instruction) {
            RS[j].busy = "N";
            RS[j].op = "";
            RS[j].vj = "";
            RS[j].vk = "";
            variable[x].done = 1;
            console.log(RS);
            break;
          }
          else if (this.state.ReservationStations[j].name.search("DIV") > -1 && this.state.ReservationStations[j].busy === "Y" && this.state.insrtuctions[x].instruction.search("div") > -1 && this.state.ReservationStations[j].op.search("div") > -1
            && this.state.insrtuctions[x].instruction == this.state.ReservationStations[j].instruction) {
            RS[j].busy = "N";
            RS[j].op = "";
            RS[j].vj = "";
            RS[j].vk = "";
            variable[x].done = 1;
            // console.log(RS);
            break;
          }
          else if (this.state.ReservationStations[j].name.search("BEQ") > -1 && this.state.ReservationStations[j].busy === "Y" && this.state.insrtuctions[x].instruction.search("beq") > -1 && this.state.ReservationStations[j].op.search("beq") > -1
            && this.state.insrtuctions[x].instruction == this.state.ReservationStations[j].instruction) {
            RS[j].busy = "N";
            RS[j].op = "";
            RS[j].vj = "";
            RS[j].vk = "";
            variable[x].done = 1;
            console.log(this.state.globalPc + " " + this.state.jumbbeq);
            // this.setState({ globalPc: this.state.jumbbeq })
            break;
          }
          else if (this.state.ReservationStations[j].name.search("SW") > -1 && this.state.ReservationStations[j].busy === "Y" && this.state.insrtuctions[x].instruction.search("sw") > -1 && this.state.ReservationStations[j].op.search("sw") > -1
            && this.state.insrtuctions[x].instruction == this.state.ReservationStations[j].instruction) {
            RS[j].busy = "N";
            RS[j].op = "";
            RS[j].vj = "";
            RS[j].vk = "";
            RS[j].A = "";
            variable[x].done = 1;

            break;
          }
          else if (this.state.ReservationStations[j].name.search("JALR") > -1 && this.state.ReservationStations[j].busy === "Y" && this.state.insrtuctions[x].instruction.search("jalr") > -1 && this.state.ReservationStations[j].op.search("jalr") > -1
            && this.state.insrtuctions[x].instruction == this.state.ReservationStations[j].instruction) {
            RS[j].busy = "N";
            RS[j].op = "";
            RS[j].vj = "";
            RS[j].vk = "";
            RS[j].A = "";
            variable[x].done = 1;

            break;
          }
          else if (this.state.ReservationStations[j].name.search("RET") > -1 && this.state.ReservationStations[j].busy === "Y" && this.state.insrtuctions[x].instruction.search("ret") > -1 && this.state.ReservationStations[j].op.search("ret") > -1
            && this.state.insrtuctions[x].instruction == this.state.ReservationStations[j].instruction) {
            RS[j].busy = "N";
            RS[j].op = "";
            RS[j].vj = "";
            RS[j].vk = "";
            RS[j].A = "";
            variable[x].done = 1;

            break;
          }

        }
      }
    }
    //---------------------------------------------------------------------------------------
    //----------------------flushing----------------------------------------------
    if (this.state.beqstart != -1 && this.state.insrtuctions[this.state.beqstart].Wb == "writing back" && beqflag == 1) {

      for (var x = this.state.beqstart + 1; x <= jumb - 1; x = x + 1) {
        for (var j = 0; j < 9; j++) {

          if (this.state.ReservationStations[j].name.search("LW") > -1
            && this.state.ReservationStations[j].busy === "Y" && this.state.insrtuctions[x].instruction.search("lw") > -1 &&
            this.state.ReservationStations[j].op.search("lw") > -1 && this.state.insrtuctions[x].instruction == this.state.ReservationStations[j].instruction) {
            RS[j].busy = "N";
            RS[j].op = "";
            RS[j].vj = "";
            RS[j].vk = "";
            RS[j].A = "";
            console.log(RS);
            break;
          }
          else if (this.state.ReservationStations[j].name.search("ADDI") > -1 && this.state.ReservationStations[j].busy === "Y" && this.state.insrtuctions[x].instruction.search("addi") > -1 && this.state.ReservationStations[j].op.search("addi") > -1
            && this.state.insrtuctions[x].instruction == this.state.ReservationStations[j].instruction) {
            RS[j].busy = "N";
            RS[j].op = "";
            RS[j].vj = "";
            RS[j].vk = "";
            RS[j].A = "";
            variable[x].done = 1;
            console.log(RS);
            break;
          }
          else if (this.state.ReservationStations[j].name.search("ADD") > -1 && this.state.ReservationStations[j].busy === "Y" && this.state.insrtuctions[x].instruction.search("add") > -1 && this.state.ReservationStations[j].op.search("add") > -1
            && this.state.insrtuctions[x].instruction == this.state.ReservationStations[j].instruction) {
            RS[j].busy = "N";
            RS[j].op = "";
            RS[j].vj = "";
            RS[j].vk = "";
            variable[x].done = 1;
            console.log(RS);
            break;
          }
          else if (this.state.ReservationStations[j].name.search("NEG") > -1 && this.state.ReservationStations[j].busy === "Y" && this.state.insrtuctions[x].instruction.search("neg") > -1 && this.state.ReservationStations[j].op.search("neg") > -1
            && this.state.insrtuctions[x].instruction == this.state.ReservationStations[j].instruction) {
            RS[j].busy = "N";
            RS[j].op = "";
            RS[j].vj = "";
            RS[j].vk = "";
            variable[x].done = 1;
            console.log(RS);
            break;
          }
          else if (this.state.ReservationStations[j].name.search("DIV") > -1 && this.state.ReservationStations[j].busy === "Y" && this.state.insrtuctions[x].instruction.search("div") > -1 && this.state.ReservationStations[j].op.search("div") > -1
            && this.state.insrtuctions[x].instruction == this.state.ReservationStations[j].instruction) {
            RS[j].busy = "N";
            RS[j].op = "";
            RS[j].vj = "";
            RS[j].vk = "";
            variable[x].done = 1;
            // console.log(RS);
            break;
          }
          else if (this.state.ReservationStations[j].name.search("BEQ") > -1 && this.state.ReservationStations[j].busy === "Y" && this.state.insrtuctions[x].instruction.search("beq") > -1 && this.state.ReservationStations[j].op.search("beq") > -1
            && this.state.insrtuctions[x].instruction == this.state.ReservationStations[j].instruction) {
            RS[j].busy = "N";
            RS[j].op = "";
            RS[j].vj = "";
            RS[j].vk = "";
            variable[x].done = 1;
            console.log(this.state.globalPc + " " + this.state.jumbbeq);
            // this.setState({ globalPc: this.state.jumbbeq })
            break;
          }
          else if (this.state.ReservationStations[j].name.search("SW") > -1 && this.state.ReservationStations[j].busy === "Y" && this.state.insrtuctions[x].instruction.search("sw") > -1 && this.state.ReservationStations[j].op.search("sw") > -1
            && this.state.insrtuctions[x].instruction == this.state.ReservationStations[j].instruction) {
            RS[j].busy = "N";
            RS[j].op = "";
            RS[j].vj = "";
            RS[j].vk = "";
            RS[j].A = "";
            variable[x].done = 1;

            break;
          }
          else if (this.state.ReservationStations[j].name.search("JALR") > -1 && this.state.ReservationStations[j].busy === "Y" && this.state.insrtuctions[x].instruction.search("jalr") > -1 && this.state.ReservationStations[j].op.search("jalr") > -1
            && this.state.insrtuctions[x].instruction == this.state.ReservationStations[j].instruction) {
            RS[j].busy = "N";
            RS[j].op = "";
            RS[j].vj = "";
            RS[j].vk = "";
            RS[j].A = "";
            variable[x].done = 1;

            break;
          }
          else if (this.state.ReservationStations[j].name.search("RET") > -1 && this.state.ReservationStations[j].busy === "Y" && this.state.insrtuctions[x].instruction.search("ret") > -1 && this.state.ReservationStations[j].op.search("ret") > -1
            && this.state.insrtuctions[x].instruction == this.state.ReservationStations[j].instruction) {
            RS[j].busy = "N";
            RS[j].op = "";
            RS[j].vj = "";
            RS[j].vk = "";
            RS[j].A = "";
            variable[x].done = 1;

            break;
          }

        }


        if (this.state.insrtuctions[x].instruction.search("sw") > -1 || this.state.insrtuctions[x].instruction.search("beq") > -1)
          ;
        else {
          operands = this.state.insrtuctions[x].instruction.replace(" ", ",")
          operands = operands.split(",");
          RD = operands[1];

          var tempRD = RD.split("x")[1];
          regs[tempRD].Qi = "";
        }
        if (variable[x].instruction.search("lw") > -1)
          variable[x] = { pc: x, instruction: variable[x].instruction, Issued: " ", issueClk: -1, ex: " ", ExClk: -1, count: 2, Wb: " ", WbClk: -1, done: -1 }
        else if (variable[x].instruction.search("sw") > -1)
          variable[x] = { pc: x, instruction: variable[x].instruction, Issued: " ", issueClk: -1, ex: " ", ExClk: -1, count: 2, Wb: " ", WbClk: -1, done: -1 }
        else if (variable[x].instruction.search("add") > -1)
          variable[x] = { pc: x, instruction: variable[x].instruction, Issued: " ", issueClk: -1, ex: " ", ExClk: -1, count: 2, Wb: " ", WbClk: -1, done: -1 }
        else if (variable[x].instruction.search("neg") > -1)
          variable[x] = { pc: x, instruction: variable[x].instruction, Issued: " ", issueClk: -1, ex: " ", ExClk: -1, count: 2, Wb: " ", WbClk: -1, done: -1 }
        else if (variable[x].instruction.search("div") > -1)
          variable[x] = { pc: x, instruction: variable[x].instruction, Issued: " ", issueClk: -1, ex: " ", ExClk: -1, count: 8, Wb: " ", WbClk: -1, done: -1 }
        else if (variable[x].instruction.search("addi") > -1)
          variable[x] = { pc: x, instruction: variable[x].instruction, Issued: " ", issueClk: -1, ex: " ", ExClk: -1, count: 2, Wb: " ", WbClk: -1, done: -1 }
        else if (variable[x].instruction.search("beq") > -1)
          variable[x] = { pc: x, instruction: variable[x].instruction, Issued: " ", issueClk: -1, ex: " ", ExClk: -1, count: 1, Wb: " ", WbClk: -1, done: -1 }
        else if (variable[x].instruction.search("jalr") > -1)
          variable[x] = { pc: x, instruction: variable[x].instruction, Issued: " ", issueClk: -1, ex: " ", ExClk: -1, count: 1, Wb: " ", WbClk: -1, done: -1 }
        else if (variable[x].instruction.search("ret") > -1)
          variable[x] = { pc: x, instruction: variable[x].instruction, Issued: " ", issueClk: -1, ex: " ", ExClk: -1, count: 1, Wb: " ", WbClk: -1, done: -1 }

        else
          variable[x] = { pc: x, instruction: variable[x].instruction, Issued: " ", issueClk: -1, ex: " ", ExClk: -1, count: 10000, Wb: " ", WbClk: -1, }

      }
      // this.setState({ beqflag: -1 })
      // this.setState({ beqstart: -1 })
      console.log("beq" + this.state.beqstart)
      console.log("jumb" + this.state.jumbbeq)
      console.log("flag" + this.state.beqflag)
    }
    //---------------------------------------------------------------------------------------
    console.log(this.state.globalPc + "this.state.beqflag " + jumb);
    if (this.state.jalrstart != -1 && this.state.insrtuctions[this.state.jalrstart].Wb == "writing back" && jalflag == 1) {
      console.log("this.state.jalrstart" + jumbjal)
      jalflag = -1;
      this.setState({ jalflag: jalflag })
      this.setState({ globalPc: jumbjal });


    }
    //beq
    else if (this.state.beqstart != -1 && this.state.insrtuctions[this.state.beqstart].Wb == "writing back" && beqflag == 1) {
      this.setState({ globalPc: jumb });
      beqflag = 0;
    }
    else if (this.state.insrtuctions[PC + 1] && this.state.insrtuctions[PC].Issued === "Issued" && this.state.insrtuctions[PC].Wb != "writing back")
      this.setState({ globalPc: this.state.globalPc + 1 })


    // console.log(this.state.globalPc + "this.state.beqflag " + this.state.beqflag);
    // console.log(this.state.insrtuctions[PC].instruction);
    // var clkflag;


    if (this.state.insrtuctions[this.state.lastinstructionPC].Wb === "writing back")
      this.setState({ clkflag: 1 })
    var clkflag = 1;
    for (var s = 0; s < variable.length; s++) {
      if (variable[s].Issued == "Issued" && variable[s].Wb != "writing back") {
        clkflag = 0;
        this.setState({ clkflag: 0 })
      }
    }


    if (this.state.clkflag == 0) {
      this.setState({ globalclk: this.state.globalclk + 1 })
    }
    else {

      this.setState({ IPC: this.state.TotalInstructin / this.state.globalclk })
      if (this.state.branchcount == 0)
        this.setState({ missPer: 0 })
      else
        this.setState({ missPer: (this.state.missNom / this.state.branchcount) * 100 })
    }


    this.setState(this.state.insrtuctions = variable)
    this.setState(this.state.ReservationStations = RS)
    this.setState(this.state.Regs = regs);
    this.setState(this.state.data = datamem)
    console.log(this.state.TotalInstructin)
    console.log(this.state.IPC)
    console.log(this.state.missPer)
    console.log(this.state.missNom)
    console.log(this.state.branchcount)

    // console.log(this.state.data);
    //jalr



  }
  /*
  
  
addi x6,x7,10;
addi x6,x7,10;
addi x6,x7,10;addi x6,x7,10;addi x6,x7,10;
beq x0,x2,-1;
 
div x2,x3,x2;
beq x1,x2,4;
addi x6,x7,10;
add x0,x0,x7;
lw x1,10(x2);
neg x1,x5;
sw x1,10(x2);
 
 
add x1,x2,x3;
addi x6,x7,10;
add x0,x0,x7;
lw x1,10(x2);
neg x1,x5;
div x2,x3,x2;
sw x1,10(x2);
 
jalr x2;
add x0,x2,x3;
add x0,x2,x3;
add x0,x2,x3;
add x0,x2,x3;
add x0,x2,x3;
add x0,x2,x3;
ret;
 
addi x6,x7,10;
addi x1,x1,1;
beq x1,x3,1;
beq x0,x2,-1;
addi x6,x7,10;
 */
  render() {

    return (

      <div  >

        <Ass
          assembly={this.state.assembly}
          insrtuctions={this.state.insrtuctions}
          addinstruction={this.addinstruction}
          assemblyText={this.assemblyText}
          handleglobalPc={this.handleglobalPc}
          globalPc={this.state.globalPc}
          globalclk={this.state.globalclk}
          ReservationStations={this.state.ReservationStations}
          Regs={this.state.Regs}
          IPC={this.state.IPC}
          missPer={this.state.missPer}
        />
      </div>
    );
  }
}
export default App;
