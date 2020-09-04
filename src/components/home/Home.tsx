import './Home.scss';

import React, { Component } from 'react';
import Button from 'react-bootstrap/Button';

import logo from '../../assets/logo.webp';
import CardComponent from '../card/Card';

interface ISmartThing {
  ip: string;
  title: string;
  animation: string;
  ws: WebSocket | undefined;
}

class App extends Component {
  smartThings: ISmartThing[] = [
    {
      ip: '192.168.0.230',
      title: 'Salon',
      animation: '26',
      ws: undefined,
    },
    {
      ip: '192.168.0.231',
      title: 'Cuisine',
      animation: '1',
      ws: undefined,
    },
  ];

  counter: number = 0;

  componentDidMount() {
    this.smartThings.forEach((smartThing) => {
      smartThing.ws = new WebSocket(`ws://${smartThing.ip}:81`);
      smartThing.ws.onopen = () => {
        console.log(`WebSocket Client Connected: ${smartThing.ip}`);
        this.counter++;
        if (this.counter === this.smartThings.length) {
          this.forceUpdate();
        }
      };
    });
  }

  off = () => {
    let counter = 0;
    const interval = setInterval(() => {
      counter++;
      this.smartThings.forEach((smartThing) => {
        smartThing.ws!.send('O_9999');
      });
      if (counter === 100) {
        clearInterval(interval);
        return;
      }
    }, 100);
  };

  on = () => {
    this.smartThings.forEach((smartThing) => {
      smartThing.ws!.send(`F_${smartThing.animation}`);
    });
  };

  render() {
    return (
      <div>
        <img
          className="d-block mx-auto my-5"
          src={logo}
          alt={'Logo'}
          width="250px"
          height="auto"
        />
        {this.counter === this.smartThings.length ? (
          <div>
            <div className="d-flex justify-content-center mb-5">
              <Button className="btn btn-secondary mr-5" onClick={this.off}>
                All Off
              </Button>
              <Button className="btn btn-primary" onClick={this.on}>
                All On
              </Button>
            </div>
            <div className="row mx-0">
              {this.smartThings.map((smartThing) => {
                return (
                  smartThing.ws && (
                    <div key={smartThing.ip} className="col-md-6 mb-3">
                      <CardComponent
                        title={smartThing.title}
                        ip={smartThing.ip}
                        animation={smartThing.animation}
                        ws={smartThing.ws as WebSocket}
                      ></CardComponent>
                    </div>
                  )
                );
              })}
            </div>
          </div>
        ) : (
          <div className="d-flex justify-content-center align-items-center">
            <div className="lds-ripple">
              <div></div>
              <div></div>
            </div>
          </div>
        )}
      </div>
    );
  }
}

export default App;
