import { View, Text, StyleSheet, TouchableOpacity, Alert } from 'react-native';
import { Database, Shield, Info } from 'lucide-react-native';
import * as SQLite from 'expo-sqlite';

export default function SettingsScreen() {
  const handleExportData = () => {
    Alert.alert(
      'Export Data',
      'This feature will be available in a future update.',
      [{ text: 'OK' }]
    );
  };

  const handleSecuritySettings = () => {
    Alert.alert(
      'Security Settings',
      'This feature will be available in a future update.',
      [{ text: 'OK' }]
    );
  };

  const handleAbout = () => {
    Alert.alert(
      'About API Key Manager',
      'Version 1.0.0\n\nA simple and secure way to manage your API keys locally.',
      [{ text: 'OK' }]
    );
  };

  return (
    <View style={styles.container}>
      <View style={styles.section}>
        <TouchableOpacity style={styles.option} onPress={handleExportData}>
          <Database size={24} color="#0891b2" />
          <View style={styles.optionText}>
            <Text style={styles.optionTitle}>Export Data</Text>
            <Text style={styles.optionDescription}>
              Export your API keys as a backup
            </Text>
          </View>
        </TouchableOpacity>

        <TouchableOpacity style={styles.option} onPress={handleSecuritySettings}>
          <Shield size={24} color="#0891b2" />
          <View style={styles.optionText}>
            <Text style={styles.optionTitle}>Security Settings</Text>
            <Text style={styles.optionDescription}>
              Configure security options
            </Text>
          </View>
        </TouchableOpacity>

        <TouchableOpacity style={styles.option} onPress={handleAbout}>
          <Info size={24} color="#0891b2" />
          <View style={styles.optionText}>
            <Text style={styles.optionTitle}>About</Text>
            <Text style={styles.optionDescription}>
              App information and version
            </Text>
          </View>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f8fafc',
    padding: 16,
  },
  section: {
    backgroundColor: '#fff',
    borderRadius: 12,
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  option: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#e2e8f0',
  },
  optionText: {
    marginLeft: 16,
    flex: 1,
  },
  optionTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#0f172a',
    marginBottom: 4,
  },
  optionDescription: {
    fontSize: 14,
    color: '#64748b',
  },
});