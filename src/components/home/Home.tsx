import './Home.scss';

import React, { Component } from 'react';
import Button from 'react-bootstrap/Button';

import logo from '../../assets/logo.webp';
import CardComponent from '../card/Card';

import isDevMode from '../../utils/isDevMode';

interface ISmartThings {
  ip: string;
  title: string;
  animation: string;
  ws: WebSocket | undefined;
}

interface IState {
  smartThings: ISmartThings[];
}

class App extends Component<any, IState> {
  counter: number = 0;
  interval: number = 0;

  constructor(props: any) {
    super(props);
    this.updateAnimation = this.updateAnimation.bind(this);
    this.state = {
      smartThings: [
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
      ],
    };

    this.updateAnimation = this.updateAnimation.bind(this);
  }

  componentDidMount() {
    this.state.smartThings.forEach((smartThing) => {
      smartThing.ws = new WebSocket(`ws://${smartThing.ip}:81`);
      smartThing.ws.onopen = () => {
        console.log(`WebSocket Client Connected: ${smartThing.ip}`);
        this.counter++;
        if (this.counter === this.state.smartThings.length || isDevMode()) {
          this.forceUpdate();
        }
      };
    });
  }

  off = () => {
    let counter = 0;
    this.interval = window.setInterval(() => {
      counter++;
      this.state.smartThings.forEach((smartThing) => {
        smartThing.ws!.send('O_9999');
      });
      if (counter === 100) {
        clearInterval(this.interval);
        return;
      }
    }, 100);
  };

  on = () => {
    clearInterval(this.interval);
    this.state.smartThings.forEach((smartThing) => {
      smartThing.ws!.send(`F_${smartThing.animation}`);
    });
  };

  updateAnimation = (e: any, i: number): void => {
    const newObject = JSON.parse(JSON.stringify(this.state.smartThings));
    newObject[i].animation = e;
    this.setState({ smartThings: newObject });
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
        {this.counter === this.state.smartThings.length || isDevMode() ? (
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
              {this.state.smartThings.map((smartThing, i) => {
                return (
                  smartThing.ws && (
                    <div key={smartThing.ip} className="col-md-6 mb-3">
                      <CardComponent
                        title={smartThing.title}
                        ip={smartThing.ip}
                        animation={smartThing.animation}
                        ws={smartThing.ws as WebSocket}
                        index={i}
                        updateAnimation={this.updateAnimation}
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
