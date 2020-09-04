import './Card.scss';

import React, { Component } from 'react';
import Button from 'react-bootstrap/Button';
import Card from 'react-bootstrap/Card';
import Form from 'react-bootstrap/Form';

interface CardProps {
  title: string;
  ip: string;
  animation: string;
  ws: WebSocket;
  index: number;
  updateAnimation: (animationNumber: string, i: number) => void;
}

interface IState {
  range: number;
}

class CardComponent extends Component<CardProps, IState> {
  title = this.props.title;
  ip = this.props.ip;
  animation = this.props.animation;
  ws = this.props.ws;
  index = this.props.index;
  updateAnimation = this.props.updateAnimation;

  interval: number = 0;
  animationNames: string[] = [
    'Rainbow Fade',
    'Rainbow Loop',
    'Rainbow Loop 2',
    'Random March',
    'RGB Propeller',
    'Rotating Red-Blue',
    'Fire',
    'Blue Fire',
    'Random Bars',
    'Flicker',
    'Random Color',
    'Sparkle',
    'Color Bounce',
    'Color Bounce Fade',
    'Blue-Red Bounce',
    'Rainbow Vertical',
    'Matrix',
    'RWB March',
    'Flame',
    'Theater Chase',
    'Strobe',
    'Police Blinker',
    'Kitt',
    'Rule',
    'Fade Vertical',
    'Runner Chameleon',
    'Blende',
    'Blende 2',
  ];

  constructor(props: CardProps) {
    super(props);
    this.state = {
      range: 25,
    };
  }

  goTo = (): void => {
    const win: Window | null = window.open(`http://${this.ip}`, '_blank');
    (win as Window).focus();
  };

  off = (): void => {
    let counter = 0;
    this.interval = window.setInterval(() => {
      counter++;
      this.ws.send('O_9999');
      if (counter === 100) {
        clearInterval(this.interval);
      }
    }, 100);
  };

  on = (): void => {
    clearInterval(this.interval);
    this.ws.send(`F_${this.animation}`);
  };

  changeBrightness = (e: React.ChangeEvent<any>): void => {
    this.setState({ range: e.target.value });
    this.ws.send(`B_${e.target.value}`);
  };

  updateAnimationLocal(animation: string): void {
    console.log('animation :>> ', animation);
    this.ws.send(`F_${animation}`);
  }

  render() {
    return (
      <div className="mx-3">
        <Card>
          {this.title ? <Card.Header as="h5">{this.title}</Card.Header> : null}
          <Card.Body>
            {this.ip ? (
              <div>
                <div className="d-flex">
                  <Card.Text className="w-50">IP: {this.ip}</Card.Text>
                  <select
                    className="form-control w-50"
                    defaultValue={this.animation}
                    onChange={(e) => {
                      this.updateAnimationLocal(e.target.value);
                      this.updateAnimation(e.target.value, this.index);
                    }}
                  >
                    {this.animationNames.map((animationName, i) => (
                      <option key={animationName} value={i}>
                        {animationName}
                      </option>
                    ))}
                  </select>
                </div>
                <div className="mt-2 d-flex">
                  <Form.Control
                    onChange={(e) => this.changeBrightness(e)}
                    type="range"
                    value={this.state.range}
                    style={{ transform: 'translateY(15px)' }}
                    className="w-75 mr-2"
                  />
                  <Form.Control
                    type="input"
                    className="w-25 form-control-sm"
                    value={this.state.range}
                    readOnly
                  ></Form.Control>
                </div>
              </div>
            ) : (
              <div className="d-flex justify-content-center">
                <Button className="btn btn-outline-primary">+</Button>
              </div>
            )}
          </Card.Body>
          {this.title && this.ip ? (
            <Card.Footer className="d-flex justify-content-around">
              <Button onClick={this.goTo} className="btn btn-outline-info">
                Go to
              </Button>
              <div>
                <Button
                  onClick={this.off}
                  className="btn btn-outline-secondary mr-3"
                >
                  Off
                </Button>
                <Button onClick={this.on} className="btn btn-outline-primary">
                  On
                </Button>
              </div>
            </Card.Footer>
          ) : null}
        </Card>
      </div>
    );
  }
}

export default CardComponent;
