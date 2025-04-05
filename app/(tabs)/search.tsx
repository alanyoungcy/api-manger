import { useState } from 'react';
import { View, Text, StyleSheet, TextInput, ScrollView, TouchableOpacity } from 'react-native';
import { Copy, Search as SearchIcon } from 'lucide-react-native';
import * as Clipboard from 'expo-clipboard';
import { searchAPIKeys, APIKey } from '@/utils/db';

export default function SearchScreen() {
  const [query, setQuery] = useState('');
  const [results, setResults] = useState<APIKey[]>([]);

  const handleSearch = async (text: string) => {
    setQuery(text);
    if (text.length > 0) {
      const searchResults = await searchAPIKeys(text);
      setResults(searchResults);
    } else {
      setResults([]);
    }
  };

  const copyToClipboard = async (key: string) => {
    await Clipboard.setStringAsync(key);
  };

  return (
    <View style={styles.container}>
      <View style={styles.searchContainer}>
        <SearchIcon size={20} color="#64748b" style={styles.searchIcon} />
        <TextInput
          style={styles.searchInput}
          placeholder="Search API keys..."
          value={query}
          onChangeText={handleSearch}
        />
      </View>
      <ScrollView style={styles.results}>
        {results.map((apiKey) => (
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
        {query.length > 0 && results.length === 0 && (
          <Text style={styles.noResults}>No API keys found</Text>
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
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#fff',
    margin: 16,
    borderRadius: 12,
    paddingHorizontal: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  searchIcon: {
    marginRight: 12,
  },
  searchInput: {
    flex: 1,
    paddingVertical: 16,
    fontSize: 16,
  },
  results: {
    padding: 16,
    paddingTop: 0,
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
  noResults: {
    textAlign: 'center',
    color: '#64748b',
    fontSize: 16,
    marginTop: 32,
  },
});