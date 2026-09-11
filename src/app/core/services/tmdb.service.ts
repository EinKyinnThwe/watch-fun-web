import { 
    HttpClient, 
    HttpParams 
} from "@angular/common/http";

import { 
    inject, 
    Injectable 
} from "@angular/core";

import { environment } from "../../../environments/environment";
import { map, Observable, shareReplay } from "rxjs";

import { 
    GenreListResponse,
    Movie, 
    MovieDetails, 
    MultiSearchItem, 
    TMDBResponse 
} from "../../shared/models/movie.model";


@Injectable({
    providedIn: 'root',
})

export class TmdbService {
    private http = inject(HttpClient);
    private baseUrl = environment.tmdb.baseUrl;
    
    private buildParams(extra: Record<string, string | number> = {}): HttpParams {
        let params = new HttpParams()
            .set('api_key', environment.tmdb.apiKey)
            .set('language', 'en-US');
        for (const [key, value] of Object.entries(extra)) {
            params = params.set(key, value);
        }
        return params;
    }
    
    // Get Trending Movies
    getTrending(timeWindow: 'day' | 'week' = 'day'): Observable<TMDBResponse<Movie>> {
        return this.http.get<TMDBResponse<Movie>>(
            `${this.baseUrl}/trending/movie/${timeWindow}`,
            { params: this.buildParams() },
        );
    }
    
    getPopular(page = 1): Observable<TMDBResponse<Movie>> {
        return this.http.get<TMDBResponse<Movie>>(`${this.baseUrl}/movie/popular`, {
            params: this.buildParams({ page }),
        });
    }

    getTopRated(page = 1): Observable<TMDBResponse<Movie>> {
        return this.http.get<TMDBResponse<Movie>>(`${this.baseUrl}/movie/top_rated`, {
            params: this.buildParams({ page }),
        });
    }

    getUpcoming(page = 1): Observable<TMDBResponse<Movie>> {
        return this.http.get<TMDBResponse<Movie>>(`${this.baseUrl}/movie/upcoming`, {
            params: this.buildParams({ page }),
        });
    }

    // getNowPlaying(page = 1): Observable<TMDBResponse<Movie>> {
    //     return this.http.get<TMDBResponse<Movie>>(`${this.baseUrl}/movie/now_playing`, {
    //         params: this.buildParams({ page }),
    //     });
    // }

    getGenres(): Observable<GenreListResponse> {
        return this.http.get<GenreListResponse>(`${this.baseUrl}/genre/movie/list`, {
            params: this.buildParams(),
        });
    }

    getMoviesByGenre(genreId: number, page = 1): Observable<TMDBResponse<Movie>> {
        return this.http.get<TMDBResponse<Movie>>(`${this.baseUrl}/discover/movie`, {
            params: this.buildParams({ with_genres: genreId, page }),
        });
    }

    searchMovies(query: string, page = 1): Observable<TMDBResponse<Movie>> {
        return this.http.get<TMDBResponse<Movie>>(`${this.baseUrl}/search/movie`, {
            params: this.buildParams({ query, page, include_adult: 'false' as unknown as number }),
        });
    }
    
    
    searchMulti(query: string, page = 1): Observable<TMDBResponse<MultiSearchItem>> {
        return this.http.get<TMDBResponse<MultiSearchItem>>(`${this.baseUrl}/search/multi`, {
            params: this.buildParams({
                query: query.trim(),
                page,
                include_adult: 'false'
            }),
        });
    }

    private genreMap$?: Observable<Record<number, string>>;

    /**
     * Genre id -> name lookup, fetched once and cached for the lifetime of
     * the app (genre lists essentially never change). Used to show a
     * movie's primary genre next to its title in search results.
     */
    getGenreMap(): Observable<Record<number, string>> {
        if (!this.genreMap$) {
            this.genreMap$ = this.getGenres().pipe(
                map((response) => Object.fromEntries(response.genres.map((g) => [g.id, g.name]))),
                shareReplay(1),
            );
        }
        return this.genreMap$;
    }

    getMovieDetails(movieId: number): Observable<MovieDetails> {
        return this.http.get<MovieDetails>(`${this.baseUrl}/movie/${movieId}`, {
            params: this.buildParams({ append_to_response: 'credits,videos,similar,recommendations' }),
        });
    }

    getImageUrl(
        path: string | null,
        size: 'w185' | 'w300' | 'w342' | 'w500' | 'w780' | 'w1280' | 'original' = 'w500',
    ): string | null {
        if (!path) return null;
        return `${environment.tmdb.imageBaseUrl}/${size}${path}`;
    }
}