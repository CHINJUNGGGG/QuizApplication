import { StyleSheet, Text, TouchableOpacity, View } from "react-native";

const Results = ({score, restart, leaderBoard}:{score:number, restart:()=>void, leaderBoard:()=>void}) => {
  return (
    <View style={styles.container}>
      <View style={styles.wrapper}>
        <Text style={{fontWeight:"600", fontSize: 16, color: "#3503c3"}} >Quiz Complete</Text>

        <Text style={{marginVertical: 20, fontWeight: "500"}} >You scored:</Text>

        <Text style={{fontWeight: "700", fontSize: 20, color: "#3503c3"}} >{score}/20</Text>

        <View style={styles.bottom}>
          <TouchableOpacity onPress={restart} activeOpacity={.8} style={styles.btn} >
            <Text style={{color:"white", fontWeight: "600"}} >Restart</Text>
          </TouchableOpacity>
          <View style={styles.buttonPadding} /> 
          <TouchableOpacity onPress={leaderBoard} activeOpacity={.8} style={styles.btn2} >
            <Text style={{color:"white", fontWeight: "600"}} >Leader Board</Text>
          </TouchableOpacity>
        </View>

      </View>
    </View>
  );
};

export default Results;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#e4e4e4",
    padding: 20,
  },
  wrapper: {
    width: "100%",
    height: 200,
    backgroundColor: "#fff",
    borderRadius: 20,
    alignItems: "center",
    justifyContent: "center",
    padding: 16,
  },
  btn: {
    width: 100,
    height: 40,
    borderRadius: 10,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#3503c3",
    marginTop: 20,
  },
  btn2: {
    width: 130,
    height: 40,
    borderRadius: 10,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#866ad6",
    marginTop: 20,
  },
  bottom: {
    flex: 1,
    justifyContent: "space-between",
    flexDirection: "row",
    marginBottom: 20,
  },
  buttonPadding: {
    paddingHorizontal: 5,
  },
});
