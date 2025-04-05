import React, { useEffect, useState, useRef } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, TextInput } from 'react-native';
import { Copy, Plus } from 'lucide-react-native';
import * as Clipboard from 'expo-clipboard';
import { initDatabase, getAllAPIKeys, insertAPIKey, APIKey } from '@/utils/db';

export default function APIKeysScreen() {
  const [apiKeys, setApiKeys] = useState<APIKey[]>([]);
  const [showAddForm, setShowAddForm] = useState(false);
  const [newKey, setNewKey] = useState({
    name: '',
    key: '',
    organization: '',
    projectId: '',
    description: '',
  });

  const isMountedRef = useRef(true);

  useEffect(() => {
    isMountedRef.current = true;

    const fetchData = async () => {
      try {
        await initDatabase();
        if (isMountedRef.current) {
          await loadAPIKeys();
        }
      } catch (error) {
        console.error("Error initializing database:", error);
      }
    };

    fetchData();

    return () => {
      isMountedRef.current = false;
    };
  }, []);

  const loadAPIKeys = async () => {
    try {
      const keys = await getAllAPIKeys();
      if (isMountedRef.current) {
        setApiKeys(keys);
      }
    } catch (error) {
      console.error("Failed to load API keys:", error);
    }
  };

  const copyToClipboard = async (key: string) => {
    try {
      await Clipboard.setStringAsync(key);
    } catch (error) {
      console.error("Failed to copy to clipboard:", error);
    }
  };

  const handleAddKey = async () => {
    if (!newKey.name || !newKey.key) return;
    try {
      await insertAPIKey(newKey);
      setNewKey({ name: '', key: '', organization: '', projectId: '', description: '' });
      setShowAddForm(false);
      await loadAPIKeys();
    } catch (error) {
      console.error("Failed to add API key:", error);
    }
  };

  return (
    <View style={styles.container}>
      <ScrollView style={styles.scrollView}>
        {showAddForm ? (
          <View style={styles.form}>
            <TextInput
              style={styles.input}
              placeholder="API Name"
              value={newKey.name}
              onChangeText={(text) => setNewKey({ ...newKey, name: text })}
            />
            <TextInput
              style={styles.input}
              placeholder="API Key"
              value={newKey.key}
              onChangeText={(text) => setNewKey({ ...newKey, key: text })}
            />
            <TextInput
              style={styles.input}
              placeholder="Organization (optional)"
              value={newKey.organization}
              onChangeText={(text) => setNewKey({ ...newKey, organization: text })}
            />
            <TextInput
              style={styles.input}
              placeholder="Project ID (optional)"
              value={newKey.projectId}
              onChangeText={(text) => setNewKey({ ...newKey, projectId: text })}
            />
            <TextInput
              style={[styles.input, styles.textArea]}
              placeholder="Description (optional)"
              value={newKey.description}
              onChangeText={(text) => setNewKey({ ...newKey, description: text })}
              multiline
              numberOfLines={3}
            />
            <View style={styles.formButtons}>
              <TouchableOpacity
                style={[styles.button, styles.cancelButton]}
                onPress={() => setShowAddForm(false)}>
                <Text style={styles.buttonText}>Cancel</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[styles.button, styles.addButton]}
                onPress={handleAddKey}>
                <Text style={styles.buttonText}>Add Key</Text>
              </TouchableOpacity>
            </View>
          </View>
        ) : (
          <>
            <TouchableOpacity
              style={styles.addKeyButton}
              onPress={() => setShowAddForm(true)}>
              <Plus size={24} color="#fff" />
              <Text style={styles.addKeyText}>Add New API Key</Text>
            </TouchableOpacity>
            {apiKeys.map((apiKey) => (
              <View key={apiKey.id} style={styles.card}>
                <View style={styles.cardHeader}>
                  <Text style={styles.name}>{apiKey.name}</Text>
                  <TouchableOpacity
                    style={styles.copyButton}
                    onPress={() => copyToClipboard(apiKey.key)}>
                    <Copy size={20} color="#0891b2" />
                  </TouchableOpacity>
                </View>
                <Text style={styles.key}>{apiKey.key}</Text>
                {apiKey.organization && (
                  <Text style={styles.detail}>Org: {apiKey.organization}</Text>
                )}
                {apiKey.projectId && (
                  <Text style={styles.detail}>Project ID: {apiKey.projectId}</Text>
                )}
                {apiKey.description && (
                  <Text style={styles.description}>{apiKey.description}</Text>
                )}
              </View>
            ))}
          </>
        )}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f8fafc',
  },
  scrollView: {
    padding: 16,
  },
  card: {
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 16,
    marginBottom: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  cardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  name: {
    fontSize: 18,
    fontWeight: '600',
    color: '#0f172a',
  },
  key: {
    fontSize: 14,
    color: '#64748b',
    marginBottom: 8,
    fontFamily: 'monospace',
  },
  detail: {
    fontSize: 14,
    color: '#475569',
    marginBottom: 4,
  },
  description: {
    fontSize: 14,
    color: '#64748b',
    marginTop: 8,
  },
  copyButton: {
    padding: 8,
  },
  addKeyButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#0891b2',
    padding: 16,
    borderRadius: 12,
    marginBottom: 16,
  },
  addKeyText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
    marginLeft: 8,
  },
  form: {
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 16,
    marginBottom: 16,
  },
  input: {
    borderWidth: 1,
    borderColor: '#e2e8f0',
    borderRadius: 8,
    padding: 12,
    marginBottom: 12,
    fontSize: 16,
  },
  textArea: {
    height: 100,
    textAlignVertical: 'top',
  },
  formButtons: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    gap: 12,
  },
  button: {
    paddingVertical: 12,
    paddingHorizontal: 24,
    borderRadius: 8,
    minWidth: 100,
    alignItems: 'center',
  },
  cancelButton: {
    backgroundColor: '#e2e8f0',
  },
  addButton: {
    backgroundColor: '#0891b2',
  },
  buttonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
});