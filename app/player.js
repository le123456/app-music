import React, { useState, useEffect } from 'react';
import { StyleSheet, TouchableOpacity, View, Text, Image } from 'react-native';
import { AntDesign } from '@expo/vector-icons';
import { Audio } from 'expo-av';
import Slider from '@react-native-community/slider';
import { Feather } from '@expo/vector-icons';

export default function Player(props) {
  const [position, setPosition] = useState(0);
  const [duration, setDuration] = useState(0);
  const [isMuted, setIsMuted] = useState(false);

  const updateProgress = async () => {
    if (props.audio != null) {
      const status = await props.audio.getStatusAsync();
      if (status.isLoaded) {
        setPosition(status.positionMillis);
        setDuration(status.durationMillis);
      }
    }
  };

  useEffect(() => {
    const interval = setInterval(updateProgress, 1000);
    return () => clearInterval(interval);
  }, [props.audio]);

  const handlePause = async () => {
    if (props.audio != null) {
      await props.audio.pauseAsync();
    }
    props.setPlaying(false);
  };

  const handlePlay = async () => {
    if (props.audio != null) {
      await props.audio.playAsync();
      props.setPlaying(true);
    } else {
      const curFile = props.musica[props.audioIndex].file;
      const newAudio = new Audio.Sound();

      try {
        await newAudio.loadAsync(curFile);
        await newAudio.playAsync();
        props.setAudio(newAudio);
        props.setPlaying(true);
      } catch (error) {
        console.error('Erro ao carregar a música:', error);
      }
    }
  };

  const handleNext = async () => {
    let nextIndex = props.audioIndex + 1;
    if (nextIndex >= props.musica.length) {
      nextIndex = 0; 
    }
    props.setAudioIndex(nextIndex);
    props.changeMusic(nextIndex);
  };

  const handlePrevious = async () => {
    let prevIndex = props.audioIndex - 1;
    if (prevIndex < 0) {
      prevIndex = props.musica.length - 1; 
    }
    props.setAudioIndex(prevIndex);
    props.changeMusic(prevIndex);
  };

  const handleMuteToggle = () => {
    setIsMuted(!isMuted);
    if (props.audio != null) {
      props.audio.setVolumeAsync(isMuted ? 1 : 0); 
    }
  };
  
  const handleProgressChange = async (value) => {
    if (props.audio != null) {
      await props.audio.setPositionAsync(value);
    }
  };

  return (
    <View style={styles.container}>
      <View style={styles.player}>
        <View style={styles.trackInfo}>
          <Image source={{ uri: props.musica[props.audioIndex].albumCover }} style={styles.albumCover} />
          <View>
            <Text style={styles.trackTitle}>{props.musica[props.audioIndex].nome}</Text>
            <Text style={styles.trackArtist}>{props.musica[props.audioIndex].artista}</Text>
          </View>
        </View>

        <View style={styles.controls}>
          <TouchableOpacity onPress={handlePrevious} style={styles.controlButton}>
            <AntDesign name="stepbackward" size={30} color="white" />
          </TouchableOpacity>

          <TouchableOpacity onPress={props.playing ? handlePause : handlePlay} style={styles.controlButton}>
            <AntDesign name={props.playing ? 'pausecircle' : 'playcircleo'} size={50} color="white" />
          </TouchableOpacity>

          <TouchableOpacity onPress={handleNext} style={styles.controlButton}>
            <AntDesign name="stepforward" size={30} color="white" />
          </TouchableOpacity>

          <TouchableOpacity onPress={handleMuteToggle} style={styles.controlButton}>
            <Feather name={isMuted ? 'volume-x' : 'volume-2'} size={30} color="white" />
          </TouchableOpacity>
        </View>

        <Slider
          style={styles.progressSlider}
          minimumValue={0}
          maximumValue={duration}
          value={position}
          onValueChange={handleProgressChange}
          minimumTrackTintColor="#1DB954"
          maximumTrackTintColor="#ccc"
        />

        <Text style={styles.progressText}>{`${Math.floor(position / 1000)} / ${Math.floor(duration / 1000)} sec`}</Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'flex-end', 
  },
  player: {
    padding: 20,
    backgroundColor: 'rgba(46, 46, 46, 0.73)',
    borderTopLeftRadius: 30,
    borderTopRightRadius: 30,
    borderTopColor:'rgba(255, 255, 255, 0.35)',
    borderTopWidth:0.1,
    shadowOffset:1,
    shadowColor:'white',
    alignItems: 'center',
    position: 'absolute', 
    bottom: 0,
    left: 0,
    right: 0,
    zIndex: 1000, 
    width: '100%',
  },
  trackInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 20,
  },
  albumCover: {
    width: 70,
    height: 70,
    borderRadius: 8,
    marginRight: 20,
  },
  trackTitle: {
    color: 'white',
    fontSize: 18,
    fontWeight: 'bold',
  },
  trackArtist: {
    color: 'white',
    fontSize: 14,
  },
  controls: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 20,
  },
  controlButton: {
    marginHorizontal: 20,
  },
  progressSlider: {
    width: '90%',
    marginBottom: 10,
  },
  progressText: {
    color: 'white',
  },
});
