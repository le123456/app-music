import { StatusBar } from 'expo-status-bar';
import React, { useState }   from 'react';
import { ScrollView, StyleSheet, Text, TouchableOpacity, View, Image, LogBox } from 'react-native';
import { Audio } from 'expo-av';
import Player from './player';

export default function App() {

  LogBox.ignoreAllLogs();

  const [audioIndex, setAudioIndex] = useState(0);
  const [playing, setPlaying] = useState(false);
  const [audio, setAudio] = useState(null);
  const [musica, setMusica] = useState([
    {
      nome: 'Tanana',
      artista: 'Fulano',
      playing: false,
      file: require('../assets/audio1.mp3'),
      albumCover: 'https://i.scdn.co/image/ab67616d0000b273baf2a68126739ff553f2930a',
    },
    {
      nome: 'Tanana',
      artista: 'Fulano',
      playing: false,
      file: require('../assets/audio2.mp3'),
      albumCover: 'https://m.media-amazon.com/images/I/61wmgIi73jL._AC_SL1007_.jpg',
    },
  ]);


  const changeMusic = async (id) => {
    setMusica((prevMusicas) =>
      prevMusicas.map((music, index) => {
        return { ...music, playing: index === id };
      })
    );

    if (audio) {
      await audio.unloadAsync();
      setAudio(null); 
    }

    
    const curFile = musica[id].file;
    const newAudio = new Audio.Sound();

    try {
      await newAudio.loadAsync(curFile);
      await newAudio.playAsync();
      setAudio(newAudio);
      setPlaying(true);
      setAudioIndex(id);
    } catch (error) {
      console.error('Erro ao carregar o áudio:', error);
    }
  };

  return (
    <View style={styles.container}>
      <StatusBar hidden />
      <ScrollView style={styles.scrollContainer}>
        <View style={styles.header}>
          <Text style={styles.headerText}>PNT | Music</Text>
        </View>

        <View style={styles.musicList}>
          {musica.map((val, k) => (
            <View style={styles.musicItem} key={k}>
              <TouchableOpacity onPress={() => changeMusic(k)} style={styles.musicTouchable}>
                <Image source={{ uri: val.albumCover }} style={styles.albumCover} />
                <View style={styles.musicDetails}>
                  <Text style={val.playing ? styles.playingText : styles.musicText}>{val.nome}</Text>
                  <Text style={val.playing ? styles.playingText : styles.artistText}>{val.artista}</Text>
                </View>
              </TouchableOpacity>
            </View>
          ))}
        </View>
      </ScrollView>

      <Player
        playing={playing}
        setPlaying={setPlaying}
        audio={audio}
        setAudio={setAudio}
        musica={musica}
        setMusica={setMusica}
        audioIndex={audioIndex}
        setAudioIndex={setAudioIndex}
        changeMusic={changeMusic}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#121212',
  },
  scrollContainer: {
    flex: 1,
  },
  header: {
    backgroundColor: '#1DB954',
    width: '100%',
    paddingTop: 40,
    paddingBottom: 20,
    paddingLeft: 20,
  },
  headerText: {
    fontSize: 35,
    fontWeight: 'bold',
    color: 'white',
  },
  musicList: {
    marginTop: 20,
  },
  musicItem: {
    flexDirection: 'row',
    padding: 20,
    borderBottomColor: '#444',
    borderBottomWidth: 1,
  },
  musicTouchable: {
    flexDirection: 'row',
    width: '100%',
  },
  albumCover: {
    width: 60,
    height: 60,
    borderRadius: 8,
    marginRight: 20,
  },
  musicDetails: {
    justifyContent: 'center',
  },
  musicText: {
    color: '#DDD',
    fontWeight: 'bold',
  },
  artistText: {
    color: '#B3B3B3',
    fontWeight: 'bold',
  },
  playingText: {
    color: '#1DB954',
    fontWeight: 'bold',
  },
});
