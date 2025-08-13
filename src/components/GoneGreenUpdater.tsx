import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { fetchGoneGreenImages } from '@/utils/fetchGoneGreenImages';

export const GoneGreenUpdater: React.FC = () => {
  const [loading, setLoading] = useState(false);
  const [results, setResults] = useState<Record<string, string> | null>(null);
  const [error, setError] = useState<string | null>(null);

  const handleFetch = async () => {
    setLoading(true);
    setError(null);
    setResults(null);

    try {
      const imageUpdates = await fetchGoneGreenImages();
      if (imageUpdates) {
        setResults(imageUpdates);
        console.log('Gone Green images fetched:', imageUpdates);
      } else {
        setError('Failed to fetch Gone Green images');
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Unknown error occurred');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Card className="w-full max-w-2xl mx-auto">
      <CardHeader>
        <CardTitle>Gone Green Image Fetcher</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <Button 
          onClick={handleFetch} 
          disabled={loading}
          className="w-full"
        >
          {loading ? 'Fetching from Zora...' : 'Fetch Gone Green Images'}
        </Button>

        {error && (
          <div className="p-4 bg-red-50 border border-red-200 rounded-md">
            <p className="text-red-700">Error: {error}</p>
          </div>
        )}

        {results && (
          <div className="space-y-2">
            <h3 className="font-semibold">Fetched Images:</h3>
            <div className="max-h-60 overflow-y-auto bg-gray-50 p-4 rounded-md">
              {Object.entries(results).map(([chonkId, imageUrl]) => (
                <div key={chonkId} className="text-sm mb-2">
                  <strong>Chonk {chonkId}:</strong>
                  <br />
                  <span className="text-blue-600 break-all">{imageUrl}</span>
                </div>
              ))}
            </div>
            <p className="text-green-700 text-sm">
              ✅ Found {Object.keys(results).length} Gone Green images
            </p>
          </div>
        )}
      </CardContent>
    </Card>
  );
};