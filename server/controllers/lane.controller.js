import Lane from '../models/lane';
import Note from '../models/note';
import uuid from 'uuid';

export function addLAne(req, res) {
  if (!req.body.name) {
    res.status(403).end();
  }

  const newLane = new Lane(req.body);

  newLane.notes = [];

  newLane.id = uuid();
  newLane.save((err, saved) => {
    if (err) {
      res.status(500).send(err);
    }
    res.json(saved);
  });
}

export function getLanes(req, res) {
  Lane.find().exec((err, lanes) => {
    if (err) {
      res.status(500).send(err);
    }
    res.json({ lanes });
  });
}

export function deleteLane(req, res) {
  Lane.findOne({ id: req.params.laneId }).exec((err, lane) => {
    if (err) {
      res.status(500).send(err);
    }

    lane.notes.forEach(note => {
      Note.remove({ _id: note });
    });

    lane.remove(() => {
      res.status(200).end();
    });
  });
}

export function editLane(req, res) {
  Lane.update({ id: req.params.laneId }, req.body.lane).exec((err, lane) => {
    if (err) {
      res.status(500).send(err);
    }

    res.json({ lane });
  });
}
